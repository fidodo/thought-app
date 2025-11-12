import { NextResponse } from "next/server";
import pg from "pg";
import admin from "firebase-admin";

let firebaseAdminConfig;
try {
  firebaseAdminConfig = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
  firebaseAdminConfig.private_key = firebaseAdminConfig.private_key.replace(
    /\\n/g,
    "\n",
  );
} catch (error) {
  console.error("❌ Error parsing FIREBASE_ADMIN_CREDENTIALS:", error.message);
  firebaseAdminConfig = null;
}

if (!admin.apps.length && firebaseAdminConfig) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
    console.log("✅ Firebase Admin initialized.");
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error.message);
  }
} else {
  console.error("❌ Missing or invalid Firebase Admin credentials.");
}

// PostgreSQL connection pool
const db = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    console.log("userId", userId);
    const { rows } = await db.query("SELECT * FROM thoughts");

    return NextResponse.json({ thoughts: rows }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching thoughts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function POST(request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email || null;
    const userName = userEmail ? userEmail.split("@")[0] : "anonymous";
    const createdAt = new Date().toISOString();

    const userCheck = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (userCheck.rows.length === 0) {
      await db.query(
        "INSERT INTO users (id, username, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5)",
        [userId, userName, userEmail, null, createdAt],
      );
    }

    // Create the thought
    const { text, section } = await request.json();
    console.log("Creating thought:", text, section);
    const { rows } = await db.query(
      "INSERT INTO thoughts (user_id, text, section) VALUES ($1, $2, $3) RETURNING *",
      [userId, text, section],
    );

    console.log("rows", rows);
    return NextResponse.json({ thought: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating thought:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing thought ID" },
        { status: 400 },
      );
    }

    console.log("Deleting thought:", id);

    const { rows } = await db.query(
      "DELETE FROM thoughts WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Thought not found or unauthorized" },
        { status: 404 },
      );
    }

    console.log("Deleted thought:", rows[0]);
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting thought:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { id, text, section } = await request.json();

    if (!id || (!text && !section)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("Updating thought:", { id, text, section });

    const { rows } = await db.query(
      "UPDATE thoughts SET text = COALESCE($1, text), section = COALESCE($2, section) WHERE id = $3 AND user_id = $4 RETURNING *",
      [text, section, id, userId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Thought not found or unauthorized" },
        { status: 404 },
      );
    }

    console.log("Updated thought:", rows[0]);
    return NextResponse.json(
      { updated: true, thought: rows[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error updating thought:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
