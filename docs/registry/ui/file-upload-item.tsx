"use client";

import * as React from "react";
import { FileUpload as SeedFileUpload, Icon } from "@seed-design/react";
import {
  IconArrowClockwiseCircularFill,
  IconPaperclipFill,
  IconXmarkFill,
} from "@karrotmarket/react-monochrome-icon";
import { formatBytes } from "../lib/format-bytes";

export interface FileUploadItemProps extends Omit<SeedFileUpload.ItemProps, "children"> {
  onRetry?: () => void;
}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  ({ onRetry, ...props }, ref) => {
    return (
      <SeedFileUpload.Item ref={ref} {...props}>
        <SeedFileUpload.ItemPreview
          image={<SeedFileUpload.ItemImage />}
          general={
            <>
              <SeedFileUpload.ItemThumbnail fallback={<Icon svg={<IconPaperclipFill />} />} />
              <SeedFileUpload.ItemMetadata>
                <SeedFileUpload.ItemName />
                <SeedFileUpload.ItemSizeText formatBytes={formatBytes} />
              </SeedFileUpload.ItemMetadata>
            </>
          }
          overlay={{
            uploading: ({ progress }) => (
              <FileUploadItemProgressCircle size="24" value={progress} />
            ),
            error: (
              <SeedFileUpload.ItemActionButton onClick={onRetry}>
                <Icon svg={<IconArrowClockwiseCircularFill />} />
                {/* You may implement your own i18n for retry label */}
                재시도
              </SeedFileUpload.ItemActionButton>
            ),
          }}
        />
        {/* You may implement your own i18n for remove label */}
        <SeedFileUpload.ItemRemoveButton aria-label="파일 제거">
          <Icon svg={<IconXmarkFill />} />
        </SeedFileUpload.ItemRemoveButton>
      </SeedFileUpload.Item>
    );
  },
);
FileUploadItem.displayName = "FileUploadItem";

interface FileUploadItemProgressCircleProps extends SeedFileUpload.ItemProgressCircleRootProps {}

const FileUploadItemProgressCircle = React.forwardRef<
  SVGSVGElement,
  FileUploadItemProgressCircleProps
>((props, ref) => (
  <SeedFileUpload.ItemProgressCircleRoot ref={ref} {...props}>
    <SeedFileUpload.ItemProgressCircleTrack />
    <SeedFileUpload.ItemProgressCircleRange />
  </SeedFileUpload.ItemProgressCircleRoot>
));
FileUploadItemProgressCircle.displayName = "FileUploadItemProgressCircle";
