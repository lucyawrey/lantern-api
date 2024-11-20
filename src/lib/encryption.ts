import { decodeBase64 } from "@oslojs/encoding";
import { createCipheriv, createDecipheriv } from "crypto";
import { DynamicBuffer } from "@oslojs/binary";
import { encryptionKey } from "utils/env";

const key = decodeBase64(encryptionKey);
