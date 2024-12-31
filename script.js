document.addEventListener("DOMContentLoaded", () => {
  const mainPage = document.getElementById("mainPage");
  const newMappingPage = document.getElementById("newMappingPage");
  const successMessage = document.getElementById("successMessage");
  const successMessageText = document.getElementById("successMessageText");
  const fieldMappings = document.getElementById("fieldMappings");
  const mappingForm = document.getElementById("mappingForm");
  const emptyState = document.querySelector(".empty-state");
  const mappingsTableContainer = document.querySelector(
    ".mappings-table-container"
  );
  const deleteModal = document.getElementById("deleteModal");
  const formTitle = document.getElementById("formTitle");
  const saveButtonText = document.getElementById("saveButtonText");

  let mappingsData = [];
  let editingId = null;
  let deletingId = null;

  const rssFields = ["timestamp", "status", "items", "goals"];
  const airtableFields = ["kv24_url", "kv24_province"];

  function createFieldMapping(rssValue = "", airtableValue = "") {
    const row = document.createElement("div");
    row.className = "field-mapping-row";

    const rssSelect = document.createElement("select");
    rssSelect.className = "field-select";
    rssSelect.innerHTML = `
          <option value="">Select RSS Field</option>
          ${rssFields
            .map(
              (field) =>
                `<option value="${field}" ${
                  field === rssValue ? "selected" : ""
                }>${field}</option>`
            )
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
            .map(
              (field) =>
                `<option value="${field}" ${
                  field === airtableValue ? "selected" : ""
                }>${field}</option>`
            )
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
  // Changes to do

  document.getElementById("backBtn").addEventListener("click", () => {
    newMappingPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
  });

  // Change above

  function showSuccessMessage(message) {
    successMessageText.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  }

  function updateMappingsDisplay() {
    if (mappingsData.length === 0) {
      emptyState.style.display = "block";
      mappingsTableContainer.classList.add("hidden");
      return;
    }

    emptyState.style.display = "none";
    mappingsTableContainer.classList.remove("hidden");
    const tbody = document.getElementById("mappingsTableBody");
    tbody.innerHTML = "";

    mappingsData.forEach((mapping) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${mapping.configName}</td>
              <td class="truncate">${mapping.rssUrl}</td>
              <td>${mapping.baseId}</td>
              <td>
                  <ul class="field-mappings-list">
                      ${mapping.fieldMappings
                        .map(
                          (field) =>
                            `<li>${field.rssField} → ${field.airtableField}</li>`
                        )
                        .join("")}
                  </ul>
              </td>
              <td>
                  <div class="action-buttons">
                      <button class="edit-btn" data-id="${mapping.id}">
                          <i class="fas fa-edit edit-icon"></i> 
                      </button>
                      <button class="delete-btn" data-id="${mapping.id}">
                          <i class="fas fa-trash"></i> 
                      </button>
                  </div>
              </td>
          `;

      tr.querySelector(".edit-btn").addEventListener("click", () => {
        editMapping(mapping);
      });

      tr.querySelector(".delete-btn").addEventListener("click", () => {
        showDeleteModal(mapping.id);
      });

      tbody.appendChild(tr);
    });
  }

  function showDeleteModal(id) {
    deletingId = id;
    deleteModal.classList.remove("hidden");
  }

  function hideDeleteModal() {
    deleteModal.classList.add("hidden");
    deletingId = null;
  }

  function deleteMapping() {
    if (deletingId) {
      mappingsData = mappingsData.filter(
        (mapping) => mapping.id !== deletingId
      );
      updateMappingsDisplay();
      showSuccessMessage("Mapping deleted successfully!");
      hideDeleteModal();
    }
  }

  function editMapping(mapping) {
    editingId = mapping.id;
    formTitle.textContent = "Edit Mapping";
    saveButtonText.textContent = "Update Mapping";

    document.getElementById("configName").value = mapping.configName;
    document.getElementById("rssUrl").value = mapping.rssUrl;
    document.getElementById("baseId").value = mapping.baseId;

    fieldMappings.innerHTML = "";
    mapping.fieldMappings.forEach((field) => {
      fieldMappings.appendChild(
        createFieldMapping(field.rssField, field.airtableField)
      );
    });

    mainPage.classList.add("hidden");
    newMappingPage.classList.remove("hidden");
  }

  document.getElementById("newMappingBtn").addEventListener("click", () => {
    editingId = null;
    formTitle.textContent = "Create New Mapping";
    saveButtonText.textContent = "Save Mapping";
    mappingForm.reset();
    fieldMappings.innerHTML = "";
    mainPage.classList.add("hidden");
    newMappingPage.classList.remove("hidden");
  });

  document.getElementById("addFieldBtn").addEventListener("click", () => {
    const newField = createFieldMapping();
    fieldMappings.appendChild(newField);
  });

  document
    .getElementById("confirmDelete")
    .addEventListener("click", deleteMapping);
  document
    .getElementById("cancelDelete")
    .addEventListener("click", hideDeleteModal);

  mappingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      id: editingId || Date.now(),
      configName: document.getElementById("configName").value,
      rssUrl: document.getElementById("rssUrl").value,
      baseId: document.getElementById("baseId").value,
      fieldMappings: Array.from(fieldMappings.children).map((row) => ({
        rssField: row.querySelector("select:first-of-type").value,
        airtableField: row.querySelector("select:last-of-type").value,
      })),
    };

    if (editingId) {
      mappingsData = mappingsData.map((mapping) =>
        mapping.id === editingId ? formData : mapping
      );
      showSuccessMessage("Mapping updated successfully!");
    } else {
      mappingsData.push(formData);
      showSuccessMessage("New mapping created successfully!");
    }

    updateMappingsDisplay();
    newMappingPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
    mappingForm.reset();
    fieldMappings.innerHTML = "";
    editingId = null;
  });
});
