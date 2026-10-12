const test = require("node:test");
const assert = require("node:assert/strict");
const { validateInternship } = require("./validation");

test("valid internship data passes validation", () => {
  const result = validateInternship({
    title: "QA Intern", company: "Acme", location: "Hyderabad",
    mode: "Remote", description: "Test web applications and report defects.",
    application_url: "https://example.com/apply"
  });
  assert.equal(result.valid, true);
});

test("missing fields fail validation", () => {
  const result = validateInternship({ title: "x" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
});

test("unsupported work mode fails validation", () => {
  const result = validateInternship({
    title: "QA Intern", company: "Acme", location: "Hyderabad",
    mode: "Anywhere", description: "Test web applications and report defects.",
    application_url: "https://example.com/apply"
  });
  assert.equal(result.valid, false);
});
