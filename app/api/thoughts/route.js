
import { NextResponse } from "next/server";
import pg from "pg";
import admin from "firebase-admin";


let firebaseAdminConfig;
try {
  firebaseAdminConfig = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
  firebaseAdminConfig.private_key = firebaseAdminConfig.private_key.replace(/\\n/g, "\n"); 
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

  
    const { rows } = await db.query("SELECT * FROM thoughts");

    return NextResponse.json({ thoughts: rows }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching thoughts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
