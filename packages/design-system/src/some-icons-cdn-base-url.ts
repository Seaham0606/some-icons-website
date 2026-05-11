import manifest from "../package.json"

export function getSomeIconsCdnBaseUrl(): string {
  const url = (manifest as { someIconsCdnBaseUrl?: string }).someIconsCdnBaseUrl
  return typeof url === "string" ? url : ""
}
