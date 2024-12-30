document.addEventListener("DOMContentLoaded", () => {
  const mainPage = document.getElementById("mainPage");
  const newMappingPage = document.getElementById("newMappingPage");
  const successMessage = document.getElementById("successMessage");
  const fieldMappings = document.getElementById("fieldMappings");

  const rssFields = ["timestamp", "status", "items", "goals"];
  const airtableFields = ["kv24_url", "kv24_province"];

  function createFieldMapping() {
    const row = document.createElement("div");
    row.className = "field-mapping-row";

    const rssSelect = document.createElement("select");
    rssSelect.className = "field-select";
    rssSelect.innerHTML = `
          <option value="">Select RSS Field</option>
          ${rssFields
            .map((field) => `<option value="${field}">${field}</option>`)
            .join("")}
      `;

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "→";

    const airtableSelect = document.createElement("select");
    airtableSelect.className = "field-select";
    airtableSelect.innerHTML = `
          <option value="">Select Airtable Field</option>
          ${airtableFields
            .map((field) => `<option value="${field}">${field}</option>`)
            .join("")}
      `;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-mapping-btn";
    deleteButton.innerHTML = "×";
    deleteButton.onclick = () => row.remove();

    row.appendChild(rssSelect);
    row.appendChild(arrow);
    row.appendChild(airtableSelect);
    row.appendChild(deleteButton);

    return row;
  }

  document.getElementById("newMappingBtn").addEventListener("click", () => {
    mainPage.classList.add("hidden");
    newMappingPage.classList.remove("hidden");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    newMappingPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
  });

  document.getElementById("addFieldBtn").addEventListener("click", () => {
    fieldMappings.appendChild(createFieldMapping());
  });

  document.getElementById("parseBtn").addEventListener("click", () => {
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
      if (fieldMappings.children.length === 0) {
        fieldMappings.appendChild(createFieldMapping());
      }
    }, 3000);
  });

  document.getElementById("mappingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    // Handle form submission here
  });
});
