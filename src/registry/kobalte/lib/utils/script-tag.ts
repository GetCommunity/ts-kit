export function ensureInlineScript(id: string, code: string) {
  if (typeof window === "undefined") return
  if (document.getElementById(id)) return
  const script = document.createElement("script")
  script.id = id
  script.text = code
  document.head.appendChild(script)
}

export function ensureExternalScript(id: string, src: string) {
  if (typeof window === "undefined") return
  if (document.getElementById(id)) return
  const script = document.createElement("script")
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function removeScriptById(id: string) {
  if (typeof window === "undefined") return
  const script = document.getElementById(id)
  if (script) {
    script.remove()
  }
}
