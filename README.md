# FirePub Action

This action uploader a file to Firebase storage and add an entry in the Firestore database

Used mostly to roll out software update

## Inputs

### `filename`

**Required** The file path to uploader (exe or apk)

### `sa-key`

**Required** Service Account JSON content

### `bucket`

**Required** The storage bucket name

### `dst`

**Required** The destination folder in the bucket

## Outputs

### `url`

The storage URL of the uploaded file

## Example usage

```yaml
uses: b4n92uid/firepub-action@main
with:
  filename: "android/app/build/outputs/apk/release/mosaic-store-release.apk"
  sa-key: ${{ secret.GCP_SA_KEY }}
  bucket: mosaic-store-dev.appspot.com
  dst: releases
```
