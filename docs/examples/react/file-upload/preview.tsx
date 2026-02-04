"use client";

import { VStack, ProgressCircle } from "@seed-design/react";
import {
  IconPlusLine,
  IconCheckmarkCircleFill,
  IconExclamationmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import {
  FileUpload,
  FileUploadContainer,
  FileUploadTrigger,
  FileUploadItemGroup,
  FileUploadItemIndicator,
} from "@/registry/ui/file-upload";
import { FileUpload as SeedFileUpload } from "@seed-design/react";

type SimpleStatus = "pending" | "success" | "error";
const STATUS_SEQUENCE: SimpleStatus[] = ["pending", "success", "error"];

export default function FileUploadPreview() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload maxFiles={5} accept="image/*">
        {({ setFileStatus }) => (
          <FileUploadContainer>
            <FileUploadTrigger>
              <IconPlusLine width={24} height={24} />
            </FileUploadTrigger>
            <FileUploadItemGroup>
              {({ acceptedFiles }) =>
                acceptedFiles.map(({ file, details }) => {
                  const cycleStatus = () => {
                    const currentIndex = STATUS_SEQUENCE.indexOf(
                      details.status === "uploading" ? "pending" : (details.status as SimpleStatus),
                    );
                    const nextStatus = STATUS_SEQUENCE[(currentIndex + 1) % STATUS_SEQUENCE.length];
                    setFileStatus(file, nextStatus);
                  };

                  return (
                    <SeedFileUpload.Item
                      key={file.name}
                      file={file}
                      onClick={cycleStatus}
                      style={{ cursor: "pointer" }}
                    >
                      <SeedFileUpload.ItemPreview>
                        <SeedFileUpload.ItemImage />
                        <FileUploadItemIndicator
                          pending={null}
                          uploading={({ progress }) => (
                            <ProgressCircle.Root
                              size="24"
                              tone="neutral"
                              value={progress}
                              style={{ margin: "auto" }}
                            >
                              <ProgressCircle.Track />
                              <ProgressCircle.Range />
                            </ProgressCircle.Root>
                          )}
                          success={
                            <IconCheckmarkCircleFill
                              width={24}
                              height={24}
                              style={{
                                margin: "auto",
                                color: "var(--seed-semantic-color-primary)",
                              }}
                            />
                          }
                          error={
                            <IconExclamationmarkCircleFill
                              width={24}
                              height={24}
                              style={{
                                margin: "auto",
                                color: "var(--seed-semantic-color-status-negative)",
                              }}
                            />
                          }
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              details.status !== "pending" ? "rgba(0,0,0,0.4)" : "transparent",
                            borderRadius: "inherit",
                          }}
                        />
                      </SeedFileUpload.ItemPreview>
                      <SeedFileUpload.ItemDeleteTrigger />
                    </SeedFileUpload.Item>
                  );
                })
              }
            </FileUploadItemGroup>
          </FileUploadContainer>
        )}
      </FileUpload>
      <p style={{ fontSize: 12, color: "var(--seed-semantic-color-fg-muted)" }}>
        Click image to cycle: pending → success → error
      </p>
    </VStack>
  );
}
