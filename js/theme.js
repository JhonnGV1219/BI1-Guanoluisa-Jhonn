const storageKey = "site-theme";

export function initThemeToggle(onThemeChange) {
  const button = document.querySelector("#themeToggle");
  if (!button) return;

  const applyTheme = theme => {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", `Cambiar a tema ${isDark ? "claro" : "oscuro"}`);
    button.title = `Cambiar a tema ${isDark ? "claro" : "oscuro"}`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#101411" : "#f4f7fb");
    onThemeChange?.(isDark ? "dark" : "light");
  };

  const initialTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      // El modo sigue siendo funcional aunque el almacenamiento esté bloqueado.
    }
    applyTheme(nextTheme);
  });
}