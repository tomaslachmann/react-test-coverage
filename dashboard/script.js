const tableBody = document.getElementById("hook-table");
const thresholdSelect = document.getElementById("threshold");

fetch("report.json")
  .then((res) => res.json())
  .then((data) => {
    renderTable(data.hooks);

    thresholdSelect.addEventListener("change", () => {
      const min = parseInt(thresholdSelect.value, 10);
      const filtered = data.hooks.filter((hook) => {
        return !hook.coverage || hook.coverage.linesPct >= min;
      });
      renderTable(filtered);
    });
  });

function renderTable(hooks) {
  tableBody.innerHTML = ""; // Clear table

  hooks.forEach((hook) => {
    const tr = document.createElement("tr");

    const lines = hook.coverage
      ? `${hook.coverage.linesCovered} / ${hook.coverage.linesTotal}`
      : "N/A";

    const linePct = hook.coverage
      ? `${hook.coverage.linesPct.toFixed(1)}%`
      : "N/A";
    const branchPct = hook.coverage
      ? `${hook.coverage.branchesPct.toFixed(1)}%`
      : "N/A";
    const fnPct = hook.coverage
      ? `${hook.coverage.functionsPct.toFixed(1)}%`
      : "N/A";

    tr.innerHTML = `
      <td><code>${hook.name}</code></td>
      <td><code>${hook.filePath}</code></td>
      <td>${hook.exported ? "✅" : "❌"}</td>
      <td>${lines}</td>
      <td>${linePct}</td>
      <td>${branchPct}</td>
      <td>${fnPct}</td>
    `;
    tableBody.appendChild(tr);
  });
}
