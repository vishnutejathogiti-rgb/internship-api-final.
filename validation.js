const allowedModes = new Set(["Remote", "Hybrid", "On-site"]);

function validateInternship(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: ["Request body must be a JSON object"] };
  }
  const fields = ["title", "company", "location", "mode", "description", "application_url"];
  for (const field of fields) {
    if (typeof input[field] !== "string" || input[field].trim() === "") {
      errors.push(`${field} is required and must be a non-empty string`);
    }
  }
  if (typeof input.title === "string" && (input.title.trim().length < 3 || input.title.trim().length > 120)) {
    errors.push("title must be between 3 and 120 characters");
  }
  if (typeof input.company === "string" && (input.company.trim().length < 2 || input.company.trim().length > 120)) {
    errors.push("company must be between 2 and 120 characters");
  }
  if (typeof input.location === "string" && (input.location.trim().length < 2 || input.location.trim().length > 120)) {
    errors.push("location must be between 2 and 120 characters");
  }
  if (typeof input.description === "string" && (input.description.trim().length < 10 || input.description.trim().length > 2000)) {
    errors.push("description must be between 10 and 2000 characters");
  }
  if (typeof input.mode === "string" && !allowedModes.has(input.mode)) {
    errors.push("mode must be Remote, Hybrid, or On-site");
  }
  if (typeof input.application_url === "string") {
    try {
      const url = new URL(input.application_url);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
    } catch {
      errors.push("application_url must be a valid http or https URL");
    }
  }
  const is_active = input.is_active === undefined ? 1 : input.is_active;
  if (![0, 1, true, false].includes(is_active)) errors.push("is_active must be a boolean or 0/1");
  if (errors.length) return { valid: false, errors };
  return {
    valid: true,
    value: {
      title: input.title.trim(),
      company: input.company.trim(),
      location: input.location.trim(),
      mode: input.mode,
      description: input.description.trim(),
      application_url: input.application_url.trim(),
      is_active: is_active === true ? 1 : is_active === false ? 0 : is_active
    }
  };
}

module.exports = { validateInternship };
