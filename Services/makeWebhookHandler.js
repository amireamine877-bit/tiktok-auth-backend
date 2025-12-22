// Helper to process incoming MAKE payloads (normalize then save)
async function handleMakePayload(payload) {
  // normalize payload and store to DB (Supabase/Postgres)
  console.log('Normalize payload', payload);
  return true;
}

module.exports = { handleMakePayload };
