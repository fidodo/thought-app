// import { NextApiRequest, NextApiResponse } from 'next';
// import pool from '../../lib/db';
// import { getAuth } from 'firebase-admin/auth';
// import { initializeApp, applicationDefault } from 'firebase-admin/app';

// const firebaseApp = initializeApp({
//   credential: applicationDefault(),
// });




// // GET: Fetch all thoughts for the current user
// const handleGetThoughts = async (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const idToken = authHeader.split(' ')[1];
//   try {
//     const decodedToken = await getAuth(firebaseApp).verifyIdToken(idToken);
//     const userId = decodedToken.uid;

//     // Fetch thoughts for the authenticated user
//     const { rows } = await pool.query(
//       'SELECT * FROM thoughts WHERE user_id = $1',
//       [userId]
//     );

//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching thoughts:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // POST: Create a new thought
// const handleCreateThought = async (req, res) => {
//   const { text, section } = req.body;
//   try {
//     const { rows } = await pool.query(
//       'INSERT INTO thoughts (user_id, text, section) VALUES ($1, $2, $3) RETURNING *',
//       [req.user.id, text, section]
//     );
//     return res.status(201).json(rows[0]);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // PUT: Update a thought (e.g., move to "done")
// const handleUpdateThought = async (req, res) => {
//   const { id } = req.query; // Get the thought ID from the URL
//   const { section } = req.body;
//   try {
//     const { rows } = await pool.query(
//       'UPDATE thoughts SET section = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
//       [section, id, req.user.id]
//     );
//     return res.status(200).json(rows[0]);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // DELETE: Delete a thought
// const handleDeleteThought = async (req, res) => {
//   const { id } = req.query; // Get the thought ID from the URL
//   try {
//     await pool.query('DELETE FROM thoughts WHERE id = $1 AND user_id = $2', [id, req.user.id]);
//     return res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Main handler function
// const handler = async (req, res) => {
//   switch (req.method) {
//     case 'GET':
//       return await handleGetThoughts(req, res);
//     case 'POST':
//       return await handleCreateThought(req, res);
//     case 'PUT':
//       return await handleUpdateThought(req, res);
//     case 'DELETE':
//       return await handleDeleteThought(req, res);
//     default:
//       return res.status(405).json({ error: 'Method Not Allowed' });
//   }
// };

// export default handler;
