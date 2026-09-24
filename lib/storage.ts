import "server-only"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucketName = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL

  const missing: string[] = []
  if (!accountId) missing.push("R2_ACCOUNT_ID")
  if (!accessKeyId) missing.push("R2_ACCESS_KEY_ID")
  if (!secretAccessKey) missing.push("R2_SECRET_ACCESS_KEY")
  if (!bucketName) missing.push("R2_BUCKET_NAME")
  if (!publicUrl) missing.push("R2_PUBLIC_URL")

  // todo later, this  is unappropriate.
  if (missing.length > 0) {
    throw new Error(
      `إعدادات Cloudflare R2 غير مكتملة في ملف البيئة (.env.local). المتغيرات الناقصة: ${missing.join(", ")}`
    )
  }

  return {
    accountId: accountId!,
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    bucketName: bucketName!,
    publicUrl: publicUrl!.replace(/\/$/, ""),
  }
}

function getR2Client(config: ReturnType<typeof getR2Config>) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

const MIME_EXT_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
}

export async function uploadImageToR2(
  fileBuffer: Uint8Array,
  originalFilename: string,
  contentType: string
): Promise<string> {
  const config = getR2Config()
  const client = getR2Client(config)

  const ext = MIME_EXT_MAP[contentType.toLowerCase()] ||
    (originalFilename.includes(".") ? `.${originalFilename.split(".").pop()}` : ".jpg")

  const randomSuffix = Math.random().toString(36).slice(2, 8)
  const timestamp = Date.now()
  const key = `events/${timestamp}-${randomSuffix}${ext}`

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  )

  return `${config.publicUrl}/${key}`
}
