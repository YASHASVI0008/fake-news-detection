export function privacyMiddleware(req: any, res: any, next: any) {
  // ❌ DO NOT TOUCH req.ip

  // Remove possible IP headers
  delete req.headers["x-forwarded-for"];
  delete req.headers["x-real-ip"];
  delete req.headers["cf-connecting-ip"];

  next();
}