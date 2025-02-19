/* eslint-disable no-console */

export const logger = {
  warn: (...OP: unknown[]) => console.warn("⚠️  Warning:", ...OP, "\n"),
  error: (...OP: unknown[]) => console.error("❌ Error:", ...OP, "\n"),
  info: (...OP: unknown[]) => console.info("🗨️  Info:", ...OP, "\n"),
  debug: (...OP: unknown[]) => console.log("🐛 Debug:", ...OP, "\n"),
  success: (...OP: unknown[]) => console.log("✅ Success:", ...OP, "\n"),
  critical: (...OP: unknown[]) => console.error("🔥 Critical:", ...OP, "\n"),
  trace: (...OP: unknown[]) => console.trace("🔎 Trace:", ...OP, "\n"),
  verbose: (...OP: unknown[]) => console.info("🗣️  Verbose:", ...OP, "\n"),
};
