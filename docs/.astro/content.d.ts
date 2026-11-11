declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MDXContent;
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	export interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof DataEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<DataEntryMap[C]>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;

	export type ReferenceDataEntry<
		C extends CollectionKey,
		E extends keyof DataEntryMap[C] = string,
	> = {
		collection: C;
		id: E;
	};

	export type ReferenceLiveEntry<C extends keyof LiveContentConfig['collections']> = {
		collection: C;
		id: string;
	};

	export function getCollection<C extends keyof DataEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof DataEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getLiveCollection<C extends keyof LiveContentConfig['collections']>(
		collection: C,
		filter?: LiveLoaderCollectionFilterType<C>,
	): Promise<
		import('astro').LiveDataCollectionResult<LiveLoaderDataType<C>, LiveLoaderErrorType<C>>
	>;

	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		entry: ReferenceDataEntry<C, E>,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? string extends keyof DataEntryMap[C]
			? Promise<DataEntryMap[C][E]> | undefined
			: Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getLiveEntry<C extends keyof LiveContentConfig['collections']>(
		collection: C,
		filter: string | LiveLoaderEntryFilterType<C>,
	): Promise<import('astro').LiveDataEntryResult<LiveLoaderDataType<C>, LiveLoaderErrorType<C>>>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof DataEntryMap>(
		entries: ReferenceDataEntry<C, keyof DataEntryMap[C]>[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof DataEntryMap>(
		entry: DataEntryMap[C][string],
	): Promise<RenderResult>;

	export function render<C extends keyof LiveContentConfig['collections']>(
		entry: import('astro').LiveDataEntry<LiveLoaderDataType<C>>,
	): Promise<RenderResult>;

	export function reference<
		C extends
			| keyof DataEntryMap
			// Allow generic `string` to avoid excessive type errors in the config
			// if `dev` is not running to update as you edit.
			// Invalid collection names will be caught at build time.
			| (string & {}),
	>(
		collection: C,
	): import('astro/zod').ZodPipe<
		import('astro/zod').ZodString,
		import('astro/zod').ZodTransform<
			C extends keyof DataEntryMap
				? {
						collection: C;
						id: string;
					}
				: never,
			string
		>
	>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof DataEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;
	type ExtractLoaderConfig<T> = T extends { loader: infer L } ? L : never;
	type InferLoaderSchema<
		C extends keyof DataEntryMap,
		L = ExtractLoaderConfig<ContentConfig['collections'][C]>,
	> = L extends { schema: import('astro/zod').ZodSchema }
		? import('astro/zod').infer<L['schema']>
		: any;

	type DataEntryMap = {
		"ai-integration": Record<string, {
  id: string;
  body?: string;
  collection: "ai-integration";
  data: InferEntrySchema<"ai-integration">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"ai-integration-meta": Record<string, {
  id: string;
  body?: string;
  collection: "ai-integration-meta";
  data: InferEntrySchema<"ai-integration-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"breeze": Record<string, {
  id: string;
  body?: string;
  collection: "breeze";
  data: InferEntrySchema<"breeze">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"breeze-meta": Record<string, {
  id: string;
  body?: string;
  collection: "breeze-meta";
  data: InferEntrySchema<"breeze-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"components": Record<string, {
  id: string;
  body?: string;
  collection: "components";
  data: InferEntrySchema<"components">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"components-meta": Record<string, {
  id: string;
  body?: string;
  collection: "components-meta";
  data: InferEntrySchema<"components-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"docs": Record<string, {
  id: string;
  body?: string;
  collection: "docs";
  data: InferEntrySchema<"docs">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"docs-meta": Record<string, {
  id: string;
  body?: string;
  collection: "docs-meta";
  data: InferEntrySchema<"docs-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"foundations": Record<string, {
  id: string;
  body?: string;
  collection: "foundations";
  data: InferEntrySchema<"foundations">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"foundations-meta": Record<string, {
  id: string;
  body?: string;
  collection: "foundations-meta";
  data: InferEntrySchema<"foundations-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"get-started": Record<string, {
  id: string;
  body?: string;
  collection: "get-started";
  data: InferEntrySchema<"get-started">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"get-started-meta": Record<string, {
  id: string;
  body?: string;
  collection: "get-started-meta";
  data: InferEntrySchema<"get-started-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"lynx": Record<string, {
  id: string;
  body?: string;
  collection: "lynx";
  data: InferEntrySchema<"lynx">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"lynx-meta": Record<string, {
  id: string;
  body?: string;
  collection: "lynx-meta";
  data: InferEntrySchema<"lynx-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"patterns": Record<string, {
  id: string;
  body?: string;
  collection: "patterns";
  data: InferEntrySchema<"patterns">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"patterns-meta": Record<string, {
  id: string;
  body?: string;
  collection: "patterns-meta";
  data: InferEntrySchema<"patterns-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"react": Record<string, {
  id: string;
  body?: string;
  collection: "react";
  data: InferEntrySchema<"react">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"react-meta": Record<string, {
  id: string;
  body?: string;
  collection: "react-meta";
  data: InferEntrySchema<"react-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"updates": Record<string, {
  id: string;
  body?: string;
  collection: "updates";
  data: InferEntrySchema<"updates">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;
"updates-meta": Record<string, {
  id: string;
  body?: string;
  collection: "updates-meta";
  data: InferEntrySchema<"updates-meta">;
  rendered?: RenderedContent;
  filePath?: string;
  digest?: string | number;
}>;

	};

	type ExtractLoaderTypes<T> = T extends import('astro/loaders').LiveLoader<
		infer TData,
		infer TEntryFilter,
		infer TCollectionFilter,
		infer TError
	>
		? { data: TData; entryFilter: TEntryFilter; collectionFilter: TCollectionFilter; error: TError }
		: { data: never; entryFilter: never; collectionFilter: never; error: never };
	type ExtractEntryFilterType<T> = ExtractLoaderTypes<T>['entryFilter'];
	type ExtractCollectionFilterType<T> = ExtractLoaderTypes<T>['collectionFilter'];
	type ExtractErrorType<T> = ExtractLoaderTypes<T>['error'];
	type ExtractDataType<T> = ExtractLoaderTypes<T>['data'];

	type LiveLoaderDataType<C extends keyof LiveContentConfig['collections']> =
		LiveContentConfig['collections'][C]['schema'] extends undefined
			? ExtractDataType<LiveContentConfig['collections'][C]['loader']>
			: import('astro/zod').infer<
					Exclude<LiveContentConfig['collections'][C]['schema'], undefined>
				>;
	type LiveLoaderEntryFilterType<C extends keyof LiveContentConfig['collections']> =
		ExtractEntryFilterType<LiveContentConfig['collections'][C]['loader']>;
	type LiveLoaderCollectionFilterType<C extends keyof LiveContentConfig['collections']> =
		ExtractCollectionFilterType<LiveContentConfig['collections'][C]['loader']>;
	type LiveLoaderErrorType<C extends keyof LiveContentConfig['collections']> = ExtractErrorType<
		LiveContentConfig['collections'][C]['loader']
	>;

	export type ContentConfig = typeof import("../src/content.config.js");
	export type LiveContentConfig = never;
}
