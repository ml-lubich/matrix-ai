export function requireMinimaxToken(): string {
  const token = process.env.MINIMAX_API_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "MINIMAX_API_TOKEN is missing. Copy .env.example to .env and set your key.",
    );
  }
  return token;
}
