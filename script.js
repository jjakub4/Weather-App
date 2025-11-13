const unitBtn = document.getElementById("unit-dropdown-btn");
const unitDropdown = document.getElementById("unit-dropdown-menu");

unitBtn.addEventListener("click", () => {
  unitDropdown.style.display =
    unitDropdown.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("click", (event) => {
  if (!unitBtn.contains(event.target)) {
    unitDropdown.style.display = "none";
  }
});
