import * as core from "@actions/core"
import { initializeApp, firestore, credential } from "firebase-admin"

import { parseUploadFilename, UpdateData, uploadToBucket } from "./helper"

try {
  ;(async () => {
    const serviceAccount = JSON.parse(core.getInput("sa-key"))

    initializeApp({
      credential: credential.cert(serviceAccount),
      storageBucket: core.getInput("bucket"),
    })

    const filename = core.getInput("filename")
    const dst = core.getInput("dst")

    core.info("Parsing filename...")

    const { version, platform } = parseUploadFilename(filename)

    const updateData: UpdateData = {
      app: "mosaic",
      createdAt: new Date(),
      version,
      platform,
    }

    core.info("Uploading...")

    updateData.url = await uploadToBucket(filename, dst)

    core.info("Submitting...")

    await firestore().collection("release").add(updateData)

    core.info(
      `Version '${updateData.version}' for '${updateData.platform}' uploaded successfully`
    )

    core.info(updateData.url)

    core.setOutput("url", updateData.url)
  })()
} catch (error) {
  core.setFailed(error.message)
}
