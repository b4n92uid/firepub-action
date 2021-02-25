import { storage } from "firebase-admin"
import { basename } from "path"

export interface UpdateData {
  app: string
  createdAt: Date
  platform?: string
  version?: string
  url?: string
}

export function parseUploadFilename(filename: string) {
  const regexp = /mosaic-store(-app)?-([0-9.]+)(-release)?.(exe|apk)$/

  filename = basename(filename)

  const matches = filename.match(regexp)

  if (!matches) {
    throw new Error(`Filename '${filename}' does not matche upload pattern`)
  }

  const info = {
    platform: "",
    version: matches[2],
  }

  if (matches[4] === "exe") info.platform = "windows"

  if (matches[4] === "apk") info.platform = "android"

  if (!info.platform) {
    throw new Error(`Unknown platform for '${filename}'`)
  }

  return info
}

export async function uploadToBucket(filename: string, dst: string) {
  const bucket = storage().bucket()

  const bn = basename(filename)
  const dest = `${dst}/${bn}`

  await bucket.upload(filename, {
    gzip: true,
    destination: dest,
    predefinedAcl: "publicRead",
    public: true,
  })

  return `https://storage.googleapis.com/${bucket.name}/${dest}`
}
