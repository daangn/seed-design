/* eslint-disable */


declare namespace GatsbyTypes {

type Maybe<T> = T | null;
type InputMaybe<T> = T | null;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  ID: string;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string;
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean;
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number;
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: string;
  GatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

type AVIFOptions = {
  readonly lossless: InputMaybe<Scalars['Boolean']>;
  readonly quality: InputMaybe<Scalars['Int']>;
  readonly speed: InputMaybe<Scalars['Int']>;
};

type BlurredOptions = {
  /** Force the output format for the low-res preview. Default is to use the same format as the input. You should rarely need to change this */
  readonly toFormat: InputMaybe<ImageFormat>;
  /** Width of the generated low-res preview. Default is 20px */
  readonly width: InputMaybe<Scalars['Int']>;
};

type BooleanQueryOperatorInput = {
  readonly eq: InputMaybe<Scalars['Boolean']>;
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Boolean']>>>;
  readonly ne: InputMaybe<Scalars['Boolean']>;
  readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Boolean']>>>;
};

type DateQueryOperatorInput = {
  readonly eq: InputMaybe<Scalars['Date']>;
  readonly gt: InputMaybe<Scalars['Date']>;
  readonly gte: InputMaybe<Scalars['Date']>;
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Date']>>>;
  readonly lt: InputMaybe<Scalars['Date']>;
  readonly lte: InputMaybe<Scalars['Date']>;
  readonly ne: InputMaybe<Scalars['Date']>;
  readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Date']>>>;
};

type Directory = Node & {
  readonly absolutePath: Scalars['String'];
  readonly accessTime: Scalars['Date'];
  readonly atime: Scalars['Date'];
  readonly atimeMs: Scalars['Float'];
  readonly base: Scalars['String'];
  readonly birthTime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  readonly birthtime: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  readonly birthtimeMs: Maybe<Scalars['Float']>;
  readonly changeTime: Scalars['Date'];
  readonly children: ReadonlyArray<Node>;
  readonly ctime: Scalars['Date'];
  readonly ctimeMs: Scalars['Float'];
  readonly dev: Scalars['Int'];
  readonly dir: Scalars['String'];
  readonly ext: Scalars['String'];
  readonly extension: Scalars['String'];
  readonly gid: Scalars['Int'];
  readonly id: Scalars['ID'];
  readonly ino: Scalars['Float'];
  readonly internal: Internal;
  readonly mode: Scalars['Int'];
  readonly modifiedTime: Scalars['Date'];
  readonly mtime: Scalars['Date'];
  readonly mtimeMs: Scalars['Float'];
  readonly name: Scalars['String'];
  readonly nlink: Scalars['Int'];
  readonly parent: Maybe<Node>;
  readonly prettySize: Scalars['String'];
  readonly rdev: Scalars['Int'];
  readonly relativeDirectory: Scalars['String'];
  readonly relativePath: Scalars['String'];
  readonly root: Scalars['String'];
  readonly size: Scalars['Int'];
  readonly sourceInstanceName: Scalars['String'];
  readonly uid: Scalars['Int'];
};


type Directory_accessTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type Directory_atimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type Directory_birthTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type Directory_changeTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type Directory_ctimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type Directory_modifiedTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type Directory_mtimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};

type DirectoryConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<DirectoryEdge>;
  readonly group: ReadonlyArray<DirectoryGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<Directory>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type DirectoryConnection_distinctArgs = {
  field: DirectoryFieldSelector;
};


type DirectoryConnection_groupArgs = {
  field: DirectoryFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type DirectoryConnection_maxArgs = {
  field: DirectoryFieldSelector;
};


type DirectoryConnection_minArgs = {
  field: DirectoryFieldSelector;
};


type DirectoryConnection_sumArgs = {
  field: DirectoryFieldSelector;
};

type DirectoryEdge = {
  readonly next: Maybe<Directory>;
  readonly node: Directory;
  readonly previous: Maybe<Directory>;
};

type DirectoryFieldSelector = {
  readonly absolutePath: InputMaybe<FieldSelectorEnum>;
  readonly accessTime: InputMaybe<FieldSelectorEnum>;
  readonly atime: InputMaybe<FieldSelectorEnum>;
  readonly atimeMs: InputMaybe<FieldSelectorEnum>;
  readonly base: InputMaybe<FieldSelectorEnum>;
  readonly birthTime: InputMaybe<FieldSelectorEnum>;
  readonly birthtime: InputMaybe<FieldSelectorEnum>;
  readonly birthtimeMs: InputMaybe<FieldSelectorEnum>;
  readonly changeTime: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly ctime: InputMaybe<FieldSelectorEnum>;
  readonly ctimeMs: InputMaybe<FieldSelectorEnum>;
  readonly dev: InputMaybe<FieldSelectorEnum>;
  readonly dir: InputMaybe<FieldSelectorEnum>;
  readonly ext: InputMaybe<FieldSelectorEnum>;
  readonly extension: InputMaybe<FieldSelectorEnum>;
  readonly gid: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly ino: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly mode: InputMaybe<FieldSelectorEnum>;
  readonly modifiedTime: InputMaybe<FieldSelectorEnum>;
  readonly mtime: InputMaybe<FieldSelectorEnum>;
  readonly mtimeMs: InputMaybe<FieldSelectorEnum>;
  readonly name: InputMaybe<FieldSelectorEnum>;
  readonly nlink: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly prettySize: InputMaybe<FieldSelectorEnum>;
  readonly rdev: InputMaybe<FieldSelectorEnum>;
  readonly relativeDirectory: InputMaybe<FieldSelectorEnum>;
  readonly relativePath: InputMaybe<FieldSelectorEnum>;
  readonly root: InputMaybe<FieldSelectorEnum>;
  readonly size: InputMaybe<FieldSelectorEnum>;
  readonly sourceInstanceName: InputMaybe<FieldSelectorEnum>;
  readonly uid: InputMaybe<FieldSelectorEnum>;
};

type DirectoryFilterInput = {
  readonly absolutePath: InputMaybe<StringQueryOperatorInput>;
  readonly accessTime: InputMaybe<DateQueryOperatorInput>;
  readonly atime: InputMaybe<DateQueryOperatorInput>;
  readonly atimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly base: InputMaybe<StringQueryOperatorInput>;
  readonly birthTime: InputMaybe<DateQueryOperatorInput>;
  readonly birthtime: InputMaybe<DateQueryOperatorInput>;
  readonly birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly changeTime: InputMaybe<DateQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly ctime: InputMaybe<DateQueryOperatorInput>;
  readonly ctimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly dev: InputMaybe<IntQueryOperatorInput>;
  readonly dir: InputMaybe<StringQueryOperatorInput>;
  readonly ext: InputMaybe<StringQueryOperatorInput>;
  readonly extension: InputMaybe<StringQueryOperatorInput>;
  readonly gid: InputMaybe<IntQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly ino: InputMaybe<FloatQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly mode: InputMaybe<IntQueryOperatorInput>;
  readonly modifiedTime: InputMaybe<DateQueryOperatorInput>;
  readonly mtime: InputMaybe<DateQueryOperatorInput>;
  readonly mtimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly name: InputMaybe<StringQueryOperatorInput>;
  readonly nlink: InputMaybe<IntQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly prettySize: InputMaybe<StringQueryOperatorInput>;
  readonly rdev: InputMaybe<IntQueryOperatorInput>;
  readonly relativeDirectory: InputMaybe<StringQueryOperatorInput>;
  readonly relativePath: InputMaybe<StringQueryOperatorInput>;
  readonly root: InputMaybe<StringQueryOperatorInput>;
  readonly size: InputMaybe<IntQueryOperatorInput>;
  readonly sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
  readonly uid: InputMaybe<IntQueryOperatorInput>;
};

type DirectoryGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<DirectoryEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<DirectoryGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<Directory>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type DirectoryGroupConnection_distinctArgs = {
  field: DirectoryFieldSelector;
};


type DirectoryGroupConnection_groupArgs = {
  field: DirectoryFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type DirectoryGroupConnection_maxArgs = {
  field: DirectoryFieldSelector;
};


type DirectoryGroupConnection_minArgs = {
  field: DirectoryFieldSelector;
};


type DirectoryGroupConnection_sumArgs = {
  field: DirectoryFieldSelector;
};

type DirectorySortInput = {
  readonly absolutePath: InputMaybe<SortOrderEnum>;
  readonly accessTime: InputMaybe<SortOrderEnum>;
  readonly atime: InputMaybe<SortOrderEnum>;
  readonly atimeMs: InputMaybe<SortOrderEnum>;
  readonly base: InputMaybe<SortOrderEnum>;
  readonly birthTime: InputMaybe<SortOrderEnum>;
  readonly birthtime: InputMaybe<SortOrderEnum>;
  readonly birthtimeMs: InputMaybe<SortOrderEnum>;
  readonly changeTime: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly ctime: InputMaybe<SortOrderEnum>;
  readonly ctimeMs: InputMaybe<SortOrderEnum>;
  readonly dev: InputMaybe<SortOrderEnum>;
  readonly dir: InputMaybe<SortOrderEnum>;
  readonly ext: InputMaybe<SortOrderEnum>;
  readonly extension: InputMaybe<SortOrderEnum>;
  readonly gid: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly ino: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly mode: InputMaybe<SortOrderEnum>;
  readonly modifiedTime: InputMaybe<SortOrderEnum>;
  readonly mtime: InputMaybe<SortOrderEnum>;
  readonly mtimeMs: InputMaybe<SortOrderEnum>;
  readonly name: InputMaybe<SortOrderEnum>;
  readonly nlink: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly prettySize: InputMaybe<SortOrderEnum>;
  readonly rdev: InputMaybe<SortOrderEnum>;
  readonly relativeDirectory: InputMaybe<SortOrderEnum>;
  readonly relativePath: InputMaybe<SortOrderEnum>;
  readonly root: InputMaybe<SortOrderEnum>;
  readonly size: InputMaybe<SortOrderEnum>;
  readonly sourceInstanceName: InputMaybe<SortOrderEnum>;
  readonly uid: InputMaybe<SortOrderEnum>;
};

type DuotoneGradient = {
  readonly highlight: Scalars['String'];
  readonly opacity: InputMaybe<Scalars['Int']>;
  readonly shadow: Scalars['String'];
};

type FieldSelectorEnum =
  | 'SELECT';

type File = Node & {
  readonly absolutePath: Scalars['String'];
  readonly accessTime: Scalars['Date'];
  readonly atime: Scalars['Date'];
  readonly atimeMs: Scalars['Float'];
  readonly base: Scalars['String'];
  readonly birthTime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  readonly birthtime: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  readonly birthtimeMs: Maybe<Scalars['Float']>;
  readonly blksize: Maybe<Scalars['Int']>;
  readonly blocks: Maybe<Scalars['Int']>;
  readonly changeTime: Scalars['Date'];
  /** Returns the first child node of type componentMetaJson or null if there are no children of given type on this node */
  readonly childComponentMetaJson: Maybe<componentMetaJson>;
  /** Returns the first child node of type ImageSharp or null if there are no children of given type on this node */
  readonly childImageSharp: Maybe<ImageSharp>;
  /** Returns the first child node of type Mdx or null if there are no children of given type on this node */
  readonly childMdx: Maybe<Mdx>;
  /** Returns the first child node of type primitiveMetaJson or null if there are no children of given type on this node */
  readonly childPrimitiveMetaJson: Maybe<primitiveMetaJson>;
  readonly children: ReadonlyArray<Node>;
  /** Returns all children nodes filtered by type componentMetaJson */
  readonly childrenComponentMetaJson: Maybe<ReadonlyArray<Maybe<componentMetaJson>>>;
  /** Returns all children nodes filtered by type ImageSharp */
  readonly childrenImageSharp: Maybe<ReadonlyArray<Maybe<ImageSharp>>>;
  /** Returns all children nodes filtered by type Mdx */
  readonly childrenMdx: Maybe<ReadonlyArray<Maybe<Mdx>>>;
  /** Returns all children nodes filtered by type primitiveMetaJson */
  readonly childrenPrimitiveMetaJson: Maybe<ReadonlyArray<Maybe<primitiveMetaJson>>>;
  readonly ctime: Scalars['Date'];
  readonly ctimeMs: Scalars['Float'];
  readonly dev: Scalars['Int'];
  readonly dir: Scalars['String'];
  readonly ext: Scalars['String'];
  readonly extension: Scalars['String'];
  readonly gid: Scalars['Int'];
  readonly id: Scalars['ID'];
  readonly ino: Scalars['Float'];
  readonly internal: Internal;
  readonly mode: Scalars['Int'];
  readonly modifiedTime: Scalars['Date'];
  readonly mtime: Scalars['Date'];
  readonly mtimeMs: Scalars['Float'];
  readonly name: Scalars['String'];
  readonly nlink: Scalars['Int'];
  readonly parent: Maybe<Node>;
  readonly prettySize: Scalars['String'];
  /** Copy file to static directory and return public url to it */
  readonly publicURL: Maybe<Scalars['String']>;
  readonly rdev: Scalars['Int'];
  readonly relativeDirectory: Scalars['String'];
  readonly relativePath: Scalars['String'];
  readonly root: Scalars['String'];
  readonly size: Scalars['Int'];
  readonly sourceInstanceName: Scalars['String'];
  readonly uid: Scalars['Int'];
};


type File_accessTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type File_atimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type File_birthTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type File_changeTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type File_ctimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type File_modifiedTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};


type File_mtimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};

type FileConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<FileEdge>;
  readonly group: ReadonlyArray<FileGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<File>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type FileConnection_distinctArgs = {
  field: FileFieldSelector;
};


type FileConnection_groupArgs = {
  field: FileFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type FileConnection_maxArgs = {
  field: FileFieldSelector;
};


type FileConnection_minArgs = {
  field: FileFieldSelector;
};


type FileConnection_sumArgs = {
  field: FileFieldSelector;
};

type FileEdge = {
  readonly next: Maybe<File>;
  readonly node: File;
  readonly previous: Maybe<File>;
};

type FileFieldSelector = {
  readonly absolutePath: InputMaybe<FieldSelectorEnum>;
  readonly accessTime: InputMaybe<FieldSelectorEnum>;
  readonly atime: InputMaybe<FieldSelectorEnum>;
  readonly atimeMs: InputMaybe<FieldSelectorEnum>;
  readonly base: InputMaybe<FieldSelectorEnum>;
  readonly birthTime: InputMaybe<FieldSelectorEnum>;
  readonly birthtime: InputMaybe<FieldSelectorEnum>;
  readonly birthtimeMs: InputMaybe<FieldSelectorEnum>;
  readonly blksize: InputMaybe<FieldSelectorEnum>;
  readonly blocks: InputMaybe<FieldSelectorEnum>;
  readonly changeTime: InputMaybe<FieldSelectorEnum>;
  readonly childComponentMetaJson: InputMaybe<componentMetaJsonFieldSelector>;
  readonly childImageSharp: InputMaybe<ImageSharpFieldSelector>;
  readonly childMdx: InputMaybe<MdxFieldSelector>;
  readonly childPrimitiveMetaJson: InputMaybe<primitiveMetaJsonFieldSelector>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly childrenComponentMetaJson: InputMaybe<componentMetaJsonFieldSelector>;
  readonly childrenImageSharp: InputMaybe<ImageSharpFieldSelector>;
  readonly childrenMdx: InputMaybe<MdxFieldSelector>;
  readonly childrenPrimitiveMetaJson: InputMaybe<primitiveMetaJsonFieldSelector>;
  readonly ctime: InputMaybe<FieldSelectorEnum>;
  readonly ctimeMs: InputMaybe<FieldSelectorEnum>;
  readonly dev: InputMaybe<FieldSelectorEnum>;
  readonly dir: InputMaybe<FieldSelectorEnum>;
  readonly ext: InputMaybe<FieldSelectorEnum>;
  readonly extension: InputMaybe<FieldSelectorEnum>;
  readonly gid: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly ino: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly mode: InputMaybe<FieldSelectorEnum>;
  readonly modifiedTime: InputMaybe<FieldSelectorEnum>;
  readonly mtime: InputMaybe<FieldSelectorEnum>;
  readonly mtimeMs: InputMaybe<FieldSelectorEnum>;
  readonly name: InputMaybe<FieldSelectorEnum>;
  readonly nlink: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly prettySize: InputMaybe<FieldSelectorEnum>;
  readonly publicURL: InputMaybe<FieldSelectorEnum>;
  readonly rdev: InputMaybe<FieldSelectorEnum>;
  readonly relativeDirectory: InputMaybe<FieldSelectorEnum>;
  readonly relativePath: InputMaybe<FieldSelectorEnum>;
  readonly root: InputMaybe<FieldSelectorEnum>;
  readonly size: InputMaybe<FieldSelectorEnum>;
  readonly sourceInstanceName: InputMaybe<FieldSelectorEnum>;
  readonly uid: InputMaybe<FieldSelectorEnum>;
};

type FileFilterInput = {
  readonly absolutePath: InputMaybe<StringQueryOperatorInput>;
  readonly accessTime: InputMaybe<DateQueryOperatorInput>;
  readonly atime: InputMaybe<DateQueryOperatorInput>;
  readonly atimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly base: InputMaybe<StringQueryOperatorInput>;
  readonly birthTime: InputMaybe<DateQueryOperatorInput>;
  readonly birthtime: InputMaybe<DateQueryOperatorInput>;
  readonly birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly blksize: InputMaybe<IntQueryOperatorInput>;
  readonly blocks: InputMaybe<IntQueryOperatorInput>;
  readonly changeTime: InputMaybe<DateQueryOperatorInput>;
  readonly childComponentMetaJson: InputMaybe<componentMetaJsonFilterInput>;
  readonly childImageSharp: InputMaybe<ImageSharpFilterInput>;
  readonly childMdx: InputMaybe<MdxFilterInput>;
  readonly childPrimitiveMetaJson: InputMaybe<primitiveMetaJsonFilterInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly childrenComponentMetaJson: InputMaybe<componentMetaJsonFilterListInput>;
  readonly childrenImageSharp: InputMaybe<ImageSharpFilterListInput>;
  readonly childrenMdx: InputMaybe<MdxFilterListInput>;
  readonly childrenPrimitiveMetaJson: InputMaybe<primitiveMetaJsonFilterListInput>;
  readonly ctime: InputMaybe<DateQueryOperatorInput>;
  readonly ctimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly dev: InputMaybe<IntQueryOperatorInput>;
  readonly dir: InputMaybe<StringQueryOperatorInput>;
  readonly ext: InputMaybe<StringQueryOperatorInput>;
  readonly extension: InputMaybe<StringQueryOperatorInput>;
  readonly gid: InputMaybe<IntQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly ino: InputMaybe<FloatQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly mode: InputMaybe<IntQueryOperatorInput>;
  readonly modifiedTime: InputMaybe<DateQueryOperatorInput>;
  readonly mtime: InputMaybe<DateQueryOperatorInput>;
  readonly mtimeMs: InputMaybe<FloatQueryOperatorInput>;
  readonly name: InputMaybe<StringQueryOperatorInput>;
  readonly nlink: InputMaybe<IntQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly prettySize: InputMaybe<StringQueryOperatorInput>;
  readonly publicURL: InputMaybe<StringQueryOperatorInput>;
  readonly rdev: InputMaybe<IntQueryOperatorInput>;
  readonly relativeDirectory: InputMaybe<StringQueryOperatorInput>;
  readonly relativePath: InputMaybe<StringQueryOperatorInput>;
  readonly root: InputMaybe<StringQueryOperatorInput>;
  readonly size: InputMaybe<IntQueryOperatorInput>;
  readonly sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
  readonly uid: InputMaybe<IntQueryOperatorInput>;
};

type FileGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<FileEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<FileGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<File>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type FileGroupConnection_distinctArgs = {
  field: FileFieldSelector;
};


type FileGroupConnection_groupArgs = {
  field: FileFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type FileGroupConnection_maxArgs = {
  field: FileFieldSelector;
};


type FileGroupConnection_minArgs = {
  field: FileFieldSelector;
};


type FileGroupConnection_sumArgs = {
  field: FileFieldSelector;
};

type FileSortInput = {
  readonly absolutePath: InputMaybe<SortOrderEnum>;
  readonly accessTime: InputMaybe<SortOrderEnum>;
  readonly atime: InputMaybe<SortOrderEnum>;
  readonly atimeMs: InputMaybe<SortOrderEnum>;
  readonly base: InputMaybe<SortOrderEnum>;
  readonly birthTime: InputMaybe<SortOrderEnum>;
  readonly birthtime: InputMaybe<SortOrderEnum>;
  readonly birthtimeMs: InputMaybe<SortOrderEnum>;
  readonly blksize: InputMaybe<SortOrderEnum>;
  readonly blocks: InputMaybe<SortOrderEnum>;
  readonly changeTime: InputMaybe<SortOrderEnum>;
  readonly childComponentMetaJson: InputMaybe<componentMetaJsonSortInput>;
  readonly childImageSharp: InputMaybe<ImageSharpSortInput>;
  readonly childMdx: InputMaybe<MdxSortInput>;
  readonly childPrimitiveMetaJson: InputMaybe<primitiveMetaJsonSortInput>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly childrenComponentMetaJson: InputMaybe<componentMetaJsonSortInput>;
  readonly childrenImageSharp: InputMaybe<ImageSharpSortInput>;
  readonly childrenMdx: InputMaybe<MdxSortInput>;
  readonly childrenPrimitiveMetaJson: InputMaybe<primitiveMetaJsonSortInput>;
  readonly ctime: InputMaybe<SortOrderEnum>;
  readonly ctimeMs: InputMaybe<SortOrderEnum>;
  readonly dev: InputMaybe<SortOrderEnum>;
  readonly dir: InputMaybe<SortOrderEnum>;
  readonly ext: InputMaybe<SortOrderEnum>;
  readonly extension: InputMaybe<SortOrderEnum>;
  readonly gid: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly ino: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly mode: InputMaybe<SortOrderEnum>;
  readonly modifiedTime: InputMaybe<SortOrderEnum>;
  readonly mtime: InputMaybe<SortOrderEnum>;
  readonly mtimeMs: InputMaybe<SortOrderEnum>;
  readonly name: InputMaybe<SortOrderEnum>;
  readonly nlink: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly prettySize: InputMaybe<SortOrderEnum>;
  readonly publicURL: InputMaybe<SortOrderEnum>;
  readonly rdev: InputMaybe<SortOrderEnum>;
  readonly relativeDirectory: InputMaybe<SortOrderEnum>;
  readonly relativePath: InputMaybe<SortOrderEnum>;
  readonly root: InputMaybe<SortOrderEnum>;
  readonly size: InputMaybe<SortOrderEnum>;
  readonly sourceInstanceName: InputMaybe<SortOrderEnum>;
  readonly uid: InputMaybe<SortOrderEnum>;
};

type FloatQueryOperatorInput = {
  readonly eq: InputMaybe<Scalars['Float']>;
  readonly gt: InputMaybe<Scalars['Float']>;
  readonly gte: InputMaybe<Scalars['Float']>;
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Float']>>>;
  readonly lt: InputMaybe<Scalars['Float']>;
  readonly lte: InputMaybe<Scalars['Float']>;
  readonly ne: InputMaybe<Scalars['Float']>;
  readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Float']>>>;
};

type GatsbyImageDataQueryOperatorInput = {
  readonly eq: InputMaybe<Scalars['GatsbyImageData']>;
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars['GatsbyImageData']>>>;
  readonly ne: InputMaybe<Scalars['GatsbyImageData']>;
  readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars['GatsbyImageData']>>>;
};

type GatsbyImageFormat =
  | 'auto'
  | 'avif'
  | 'jpg'
  | ''
  | 'png'
  | 'webp';

type GatsbyImageLayout =
  | 'constrained'
  | 'fixed'
  | 'fullWidth';

type GatsbyImagePlaceholder =
  | 'blurred'
  | 'dominantColor'
  | 'none'
  | 'tracedSVG';

type ImageCropFocus =
  | 17
  | 0
  | 2
  | 16
  | 1
  | 5
  | 8
  | 3
  | 6
  | 7
  | 4;

type ImageFit =
  | 'contain'
  | 'cover'
  | 'fill'
  | 'inside'
  | 'outside';

type ImageFormat =
  | ''
  | 'avif'
  | 'jpg'
  | ''
  | 'png'
  | 'webp';

type ImageLayout =
  | 'constrained'
  | 'fixed'
  | 'fullWidth';

type ImagePlaceholder =
  | 'blurred'
  | 'dominantColor'
  | 'none'
  | 'tracedSVG';

type ImageSharp = Node & {
  readonly children: ReadonlyArray<Node>;
  readonly fixed: Maybe<ImageSharpFixed>;
  readonly fluid: Maybe<ImageSharpFluid>;
  readonly gatsbyImageData: Scalars['GatsbyImageData'];
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly original: Maybe<ImageSharpOriginal>;
  readonly parent: Maybe<Node>;
  readonly resize: Maybe<ImageSharpResize>;
};


type ImageSharp_fixedArgs = {
  background?: InputMaybe<Scalars['String']>;
  base64Width: InputMaybe<Scalars['Int']>;
  cropFocus?: InputMaybe<ImageCropFocus>;
  duotone?: InputMaybe<DuotoneGradient>;
  fit?: InputMaybe<ImageFit>;
  grayscale?: InputMaybe<Scalars['Boolean']>;
  height: InputMaybe<Scalars['Int']>;
  jpegProgressive?: InputMaybe<Scalars['Boolean']>;
  jpegQuality: InputMaybe<Scalars['Int']>;
  pngCompressionSpeed?: InputMaybe<Scalars['Int']>;
  pngQuality: InputMaybe<Scalars['Int']>;
  quality: InputMaybe<Scalars['Int']>;
  rotate?: InputMaybe<Scalars['Int']>;
  toFormat?: InputMaybe<ImageFormat>;
  toFormatBase64?: InputMaybe<ImageFormat>;
  traceSVG?: InputMaybe<Potrace>;
  trim?: InputMaybe<Scalars['Float']>;
  webpQuality: InputMaybe<Scalars['Int']>;
  width: InputMaybe<Scalars['Int']>;
};


type ImageSharp_fluidArgs = {
  background?: InputMaybe<Scalars['String']>;
  base64Width: InputMaybe<Scalars['Int']>;
  cropFocus?: InputMaybe<ImageCropFocus>;
  duotone?: InputMaybe<DuotoneGradient>;
  fit?: InputMaybe<ImageFit>;
  grayscale?: InputMaybe<Scalars['Boolean']>;
  jpegProgressive?: InputMaybe<Scalars['Boolean']>;
  jpegQuality: InputMaybe<Scalars['Int']>;
  maxHeight: InputMaybe<Scalars['Int']>;
  maxWidth: InputMaybe<Scalars['Int']>;
  pngCompressionSpeed?: InputMaybe<Scalars['Int']>;
  pngQuality: InputMaybe<Scalars['Int']>;
  quality: InputMaybe<Scalars['Int']>;
  rotate?: InputMaybe<Scalars['Int']>;
  sizes?: InputMaybe<Scalars['String']>;
  srcSetBreakpoints?: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Int']>>>;
  toFormat?: InputMaybe<ImageFormat>;
  toFormatBase64?: InputMaybe<ImageFormat>;
  traceSVG?: InputMaybe<Potrace>;
  trim?: InputMaybe<Scalars['Float']>;
  webpQuality: InputMaybe<Scalars['Int']>;
};


type ImageSharp_gatsbyImageDataArgs = {
  aspectRatio: InputMaybe<Scalars['Float']>;
  avifOptions: InputMaybe<AVIFOptions>;
  backgroundColor: InputMaybe<Scalars['String']>;
  blurredOptions: InputMaybe<BlurredOptions>;
  breakpoints: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Int']>>>;
  formats: InputMaybe<ReadonlyArray<InputMaybe<ImageFormat>>>;
  height: InputMaybe<Scalars['Int']>;
  jpgOptions: InputMaybe<JPGOptions>;
  layout?: InputMaybe<ImageLayout>;
  outputPixelDensities: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Float']>>>;
  placeholder: InputMaybe<ImagePlaceholder>;
  pngOptions: InputMaybe<PNGOptions>;
  quality: InputMaybe<Scalars['Int']>;
  sizes: InputMaybe<Scalars['String']>;
  tracedSVGOptions: InputMaybe<Potrace>;
  transformOptions: InputMaybe<TransformOptions>;
  webpOptions: InputMaybe<WebPOptions>;
  width: InputMaybe<Scalars['Int']>;
};


type ImageSharp_resizeArgs = {
  background?: InputMaybe<Scalars['String']>;
  base64?: InputMaybe<Scalars['Boolean']>;
  cropFocus?: InputMaybe<ImageCropFocus>;
  duotone?: InputMaybe<DuotoneGradient>;
  fit?: InputMaybe<ImageFit>;
  grayscale?: InputMaybe<Scalars['Boolean']>;
  height: InputMaybe<Scalars['Int']>;
  jpegProgressive?: InputMaybe<Scalars['Boolean']>;
  jpegQuality: InputMaybe<Scalars['Int']>;
  pngCompressionLevel?: InputMaybe<Scalars['Int']>;
  pngCompressionSpeed?: InputMaybe<Scalars['Int']>;
  pngQuality: InputMaybe<Scalars['Int']>;
  quality: InputMaybe<Scalars['Int']>;
  rotate?: InputMaybe<Scalars['Int']>;
  toFormat?: InputMaybe<ImageFormat>;
  traceSVG?: InputMaybe<Potrace>;
  trim?: InputMaybe<Scalars['Float']>;
  webpQuality: InputMaybe<Scalars['Int']>;
  width: InputMaybe<Scalars['Int']>;
};

type ImageSharpConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<ImageSharpEdge>;
  readonly group: ReadonlyArray<ImageSharpGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<ImageSharp>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type ImageSharpConnection_distinctArgs = {
  field: ImageSharpFieldSelector;
};


type ImageSharpConnection_groupArgs = {
  field: ImageSharpFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type ImageSharpConnection_maxArgs = {
  field: ImageSharpFieldSelector;
};


type ImageSharpConnection_minArgs = {
  field: ImageSharpFieldSelector;
};


type ImageSharpConnection_sumArgs = {
  field: ImageSharpFieldSelector;
};

type ImageSharpEdge = {
  readonly next: Maybe<ImageSharp>;
  readonly node: ImageSharp;
  readonly previous: Maybe<ImageSharp>;
};

type ImageSharpFieldSelector = {
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly fixed: InputMaybe<ImageSharpFixedFieldSelector>;
  readonly fluid: InputMaybe<ImageSharpFluidFieldSelector>;
  readonly gatsbyImageData: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly original: InputMaybe<ImageSharpOriginalFieldSelector>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly resize: InputMaybe<ImageSharpResizeFieldSelector>;
};

type ImageSharpFilterInput = {
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly fixed: InputMaybe<ImageSharpFixedFilterInput>;
  readonly fluid: InputMaybe<ImageSharpFluidFilterInput>;
  readonly gatsbyImageData: InputMaybe<GatsbyImageDataQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly original: InputMaybe<ImageSharpOriginalFilterInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly resize: InputMaybe<ImageSharpResizeFilterInput>;
};

type ImageSharpFilterListInput = {
  readonly elemMatch: InputMaybe<ImageSharpFilterInput>;
};

type ImageSharpFixed = {
  readonly aspectRatio: Maybe<Scalars['Float']>;
  readonly base64: Maybe<Scalars['String']>;
  readonly height: Scalars['Float'];
  readonly originalName: Maybe<Scalars['String']>;
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly width: Scalars['Float'];
};

type ImageSharpFixedFieldSelector = {
  readonly aspectRatio: InputMaybe<FieldSelectorEnum>;
  readonly base64: InputMaybe<FieldSelectorEnum>;
  readonly height: InputMaybe<FieldSelectorEnum>;
  readonly originalName: InputMaybe<FieldSelectorEnum>;
  readonly src: InputMaybe<FieldSelectorEnum>;
  readonly srcSet: InputMaybe<FieldSelectorEnum>;
  readonly srcSetWebp: InputMaybe<FieldSelectorEnum>;
  readonly srcWebp: InputMaybe<FieldSelectorEnum>;
  readonly tracedSVG: InputMaybe<FieldSelectorEnum>;
  readonly width: InputMaybe<FieldSelectorEnum>;
};

type ImageSharpFixedFilterInput = {
  readonly aspectRatio: InputMaybe<FloatQueryOperatorInput>;
  readonly base64: InputMaybe<StringQueryOperatorInput>;
  readonly height: InputMaybe<FloatQueryOperatorInput>;
  readonly originalName: InputMaybe<StringQueryOperatorInput>;
  readonly src: InputMaybe<StringQueryOperatorInput>;
  readonly srcSet: InputMaybe<StringQueryOperatorInput>;
  readonly srcSetWebp: InputMaybe<StringQueryOperatorInput>;
  readonly srcWebp: InputMaybe<StringQueryOperatorInput>;
  readonly tracedSVG: InputMaybe<StringQueryOperatorInput>;
  readonly width: InputMaybe<FloatQueryOperatorInput>;
};

type ImageSharpFixedSortInput = {
  readonly aspectRatio: InputMaybe<SortOrderEnum>;
  readonly base64: InputMaybe<SortOrderEnum>;
  readonly height: InputMaybe<SortOrderEnum>;
  readonly originalName: InputMaybe<SortOrderEnum>;
  readonly src: InputMaybe<SortOrderEnum>;
  readonly srcSet: InputMaybe<SortOrderEnum>;
  readonly srcSetWebp: InputMaybe<SortOrderEnum>;
  readonly srcWebp: InputMaybe<SortOrderEnum>;
  readonly tracedSVG: InputMaybe<SortOrderEnum>;
  readonly width: InputMaybe<SortOrderEnum>;
};

type ImageSharpFluid = {
  readonly aspectRatio: Scalars['Float'];
  readonly base64: Maybe<Scalars['String']>;
  readonly originalImg: Maybe<Scalars['String']>;
  readonly originalName: Maybe<Scalars['String']>;
  readonly presentationHeight: Scalars['Int'];
  readonly presentationWidth: Scalars['Int'];
  readonly sizes: Scalars['String'];
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
};

type ImageSharpFluidFieldSelector = {
  readonly aspectRatio: InputMaybe<FieldSelectorEnum>;
  readonly base64: InputMaybe<FieldSelectorEnum>;
  readonly originalImg: InputMaybe<FieldSelectorEnum>;
  readonly originalName: InputMaybe<FieldSelectorEnum>;
  readonly presentationHeight: InputMaybe<FieldSelectorEnum>;
  readonly presentationWidth: InputMaybe<FieldSelectorEnum>;
  readonly sizes: InputMaybe<FieldSelectorEnum>;
  readonly src: InputMaybe<FieldSelectorEnum>;
  readonly srcSet: InputMaybe<FieldSelectorEnum>;
  readonly srcSetWebp: InputMaybe<FieldSelectorEnum>;
  readonly srcWebp: InputMaybe<FieldSelectorEnum>;
  readonly tracedSVG: InputMaybe<FieldSelectorEnum>;
};

type ImageSharpFluidFilterInput = {
  readonly aspectRatio: InputMaybe<FloatQueryOperatorInput>;
  readonly base64: InputMaybe<StringQueryOperatorInput>;
  readonly originalImg: InputMaybe<StringQueryOperatorInput>;
  readonly originalName: InputMaybe<StringQueryOperatorInput>;
  readonly presentationHeight: InputMaybe<IntQueryOperatorInput>;
  readonly presentationWidth: InputMaybe<IntQueryOperatorInput>;
  readonly sizes: InputMaybe<StringQueryOperatorInput>;
  readonly src: InputMaybe<StringQueryOperatorInput>;
  readonly srcSet: InputMaybe<StringQueryOperatorInput>;
  readonly srcSetWebp: InputMaybe<StringQueryOperatorInput>;
  readonly srcWebp: InputMaybe<StringQueryOperatorInput>;
  readonly tracedSVG: InputMaybe<StringQueryOperatorInput>;
};

type ImageSharpFluidSortInput = {
  readonly aspectRatio: InputMaybe<SortOrderEnum>;
  readonly base64: InputMaybe<SortOrderEnum>;
  readonly originalImg: InputMaybe<SortOrderEnum>;
  readonly originalName: InputMaybe<SortOrderEnum>;
  readonly presentationHeight: InputMaybe<SortOrderEnum>;
  readonly presentationWidth: InputMaybe<SortOrderEnum>;
  readonly sizes: InputMaybe<SortOrderEnum>;
  readonly src: InputMaybe<SortOrderEnum>;
  readonly srcSet: InputMaybe<SortOrderEnum>;
  readonly srcSetWebp: InputMaybe<SortOrderEnum>;
  readonly srcWebp: InputMaybe<SortOrderEnum>;
  readonly tracedSVG: InputMaybe<SortOrderEnum>;
};

type ImageSharpGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<ImageSharpEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<ImageSharpGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<ImageSharp>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type ImageSharpGroupConnection_distinctArgs = {
  field: ImageSharpFieldSelector;
};


type ImageSharpGroupConnection_groupArgs = {
  field: ImageSharpFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type ImageSharpGroupConnection_maxArgs = {
  field: ImageSharpFieldSelector;
};


type ImageSharpGroupConnection_minArgs = {
  field: ImageSharpFieldSelector;
};


type ImageSharpGroupConnection_sumArgs = {
  field: ImageSharpFieldSelector;
};

type ImageSharpOriginal = {
  readonly height: Maybe<Scalars['Float']>;
  readonly src: Maybe<Scalars['String']>;
  readonly width: Maybe<Scalars['Float']>;
};

type ImageSharpOriginalFieldSelector = {
  readonly height: InputMaybe<FieldSelectorEnum>;
  readonly src: InputMaybe<FieldSelectorEnum>;
  readonly width: InputMaybe<FieldSelectorEnum>;
};

type ImageSharpOriginalFilterInput = {
  readonly height: InputMaybe<FloatQueryOperatorInput>;
  readonly src: InputMaybe<StringQueryOperatorInput>;
  readonly width: InputMaybe<FloatQueryOperatorInput>;
};

type ImageSharpOriginalSortInput = {
  readonly height: InputMaybe<SortOrderEnum>;
  readonly src: InputMaybe<SortOrderEnum>;
  readonly width: InputMaybe<SortOrderEnum>;
};

type ImageSharpResize = {
  readonly aspectRatio: Maybe<Scalars['Float']>;
  readonly height: Maybe<Scalars['Int']>;
  readonly originalName: Maybe<Scalars['String']>;
  readonly src: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly width: Maybe<Scalars['Int']>;
};

type ImageSharpResizeFieldSelector = {
  readonly aspectRatio: InputMaybe<FieldSelectorEnum>;
  readonly height: InputMaybe<FieldSelectorEnum>;
  readonly originalName: InputMaybe<FieldSelectorEnum>;
  readonly src: InputMaybe<FieldSelectorEnum>;
  readonly tracedSVG: InputMaybe<FieldSelectorEnum>;
  readonly width: InputMaybe<FieldSelectorEnum>;
};

type ImageSharpResizeFilterInput = {
  readonly aspectRatio: InputMaybe<FloatQueryOperatorInput>;
  readonly height: InputMaybe<IntQueryOperatorInput>;
  readonly originalName: InputMaybe<StringQueryOperatorInput>;
  readonly src: InputMaybe<StringQueryOperatorInput>;
  readonly tracedSVG: InputMaybe<StringQueryOperatorInput>;
  readonly width: InputMaybe<IntQueryOperatorInput>;
};

type ImageSharpResizeSortInput = {
  readonly aspectRatio: InputMaybe<SortOrderEnum>;
  readonly height: InputMaybe<SortOrderEnum>;
  readonly originalName: InputMaybe<SortOrderEnum>;
  readonly src: InputMaybe<SortOrderEnum>;
  readonly tracedSVG: InputMaybe<SortOrderEnum>;
  readonly width: InputMaybe<SortOrderEnum>;
};

type ImageSharpSortInput = {
  readonly children: InputMaybe<NodeSortInput>;
  readonly fixed: InputMaybe<ImageSharpFixedSortInput>;
  readonly fluid: InputMaybe<ImageSharpFluidSortInput>;
  readonly gatsbyImageData: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly original: InputMaybe<ImageSharpOriginalSortInput>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly resize: InputMaybe<ImageSharpResizeSortInput>;
};

type IntQueryOperatorInput = {
  readonly eq: InputMaybe<Scalars['Int']>;
  readonly gt: InputMaybe<Scalars['Int']>;
  readonly gte: InputMaybe<Scalars['Int']>;
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Int']>>>;
  readonly lt: InputMaybe<Scalars['Int']>;
  readonly lte: InputMaybe<Scalars['Int']>;
  readonly ne: InputMaybe<Scalars['Int']>;
  readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars['Int']>>>;
};

type Internal = {
  readonly content: Maybe<Scalars['String']>;
  readonly contentDigest: Scalars['String'];
  readonly contentFilePath: Maybe<Scalars['String']>;
  readonly description: Maybe<Scalars['String']>;
  readonly fieldOwners: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly ignoreType: Maybe<Scalars['Boolean']>;
  readonly mediaType: Maybe<Scalars['String']>;
  readonly owner: Scalars['String'];
  readonly type: Scalars['String'];
};

type InternalFieldSelector = {
  readonly content: InputMaybe<FieldSelectorEnum>;
  readonly contentDigest: InputMaybe<FieldSelectorEnum>;
  readonly contentFilePath: InputMaybe<FieldSelectorEnum>;
  readonly description: InputMaybe<FieldSelectorEnum>;
  readonly fieldOwners: InputMaybe<FieldSelectorEnum>;
  readonly ignoreType: InputMaybe<FieldSelectorEnum>;
  readonly mediaType: InputMaybe<FieldSelectorEnum>;
  readonly owner: InputMaybe<FieldSelectorEnum>;
  readonly type: InputMaybe<FieldSelectorEnum>;
};

type InternalFilterInput = {
  readonly content: InputMaybe<StringQueryOperatorInput>;
  readonly contentDigest: InputMaybe<StringQueryOperatorInput>;
  readonly contentFilePath: InputMaybe<StringQueryOperatorInput>;
  readonly description: InputMaybe<StringQueryOperatorInput>;
  readonly fieldOwners: InputMaybe<StringQueryOperatorInput>;
  readonly ignoreType: InputMaybe<BooleanQueryOperatorInput>;
  readonly mediaType: InputMaybe<StringQueryOperatorInput>;
  readonly owner: InputMaybe<StringQueryOperatorInput>;
  readonly type: InputMaybe<StringQueryOperatorInput>;
};

type InternalSortInput = {
  readonly content: InputMaybe<SortOrderEnum>;
  readonly contentDigest: InputMaybe<SortOrderEnum>;
  readonly contentFilePath: InputMaybe<SortOrderEnum>;
  readonly description: InputMaybe<SortOrderEnum>;
  readonly fieldOwners: InputMaybe<SortOrderEnum>;
  readonly ignoreType: InputMaybe<SortOrderEnum>;
  readonly mediaType: InputMaybe<SortOrderEnum>;
  readonly owner: InputMaybe<SortOrderEnum>;
  readonly type: InputMaybe<SortOrderEnum>;
};

type JPGOptions = {
  readonly progressive: InputMaybe<Scalars['Boolean']>;
  readonly quality: InputMaybe<Scalars['Int']>;
};

type JSONQueryOperatorInput = {
  readonly eq: InputMaybe<Scalars['JSON']>;
  readonly glob: InputMaybe<Scalars['JSON']>;
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars['JSON']>>>;
  readonly ne: InputMaybe<Scalars['JSON']>;
  readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars['JSON']>>>;
  readonly regex: InputMaybe<Scalars['JSON']>;
};

type LocalSearchPages = Node & {
  readonly children: ReadonlyArray<Node>;
  /** The search engine used to create the index. */
  readonly engine: Scalars['String'];
  readonly id: Scalars['ID'];
  /** The search index created using the selected engine. */
  readonly index: Scalars['String'];
  readonly internal: Internal;
  /** The name of the index. */
  readonly name: Scalars['String'];
  readonly parent: Maybe<Node>;
  /** Save the index to the site's static directory and return a public URL to it. */
  readonly publicIndexURL: Scalars['String'];
  /** Save the store to the site's static directory and return a public URL to it. */
  readonly publicStoreURL: Scalars['String'];
  /** A JSON object used to map search results to their data. */
  readonly store: Scalars['JSON'];
};

type LocalSearchPagesConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<LocalSearchPagesEdge>;
  readonly group: ReadonlyArray<LocalSearchPagesGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<LocalSearchPages>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type LocalSearchPagesConnection_distinctArgs = {
  field: LocalSearchPagesFieldSelector;
};


type LocalSearchPagesConnection_groupArgs = {
  field: LocalSearchPagesFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type LocalSearchPagesConnection_maxArgs = {
  field: LocalSearchPagesFieldSelector;
};


type LocalSearchPagesConnection_minArgs = {
  field: LocalSearchPagesFieldSelector;
};


type LocalSearchPagesConnection_sumArgs = {
  field: LocalSearchPagesFieldSelector;
};

type LocalSearchPagesEdge = {
  readonly next: Maybe<LocalSearchPages>;
  readonly node: LocalSearchPages;
  readonly previous: Maybe<LocalSearchPages>;
};

type LocalSearchPagesFieldSelector = {
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly engine: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly index: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly name: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly publicIndexURL: InputMaybe<FieldSelectorEnum>;
  readonly publicStoreURL: InputMaybe<FieldSelectorEnum>;
  readonly store: InputMaybe<FieldSelectorEnum>;
};

type LocalSearchPagesFilterInput = {
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly engine: InputMaybe<StringQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly index: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly name: InputMaybe<StringQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly publicIndexURL: InputMaybe<StringQueryOperatorInput>;
  readonly publicStoreURL: InputMaybe<StringQueryOperatorInput>;
  readonly store: InputMaybe<JSONQueryOperatorInput>;
};

type LocalSearchPagesGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<LocalSearchPagesEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<LocalSearchPagesGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<LocalSearchPages>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type LocalSearchPagesGroupConnection_distinctArgs = {
  field: LocalSearchPagesFieldSelector;
};


type LocalSearchPagesGroupConnection_groupArgs = {
  field: LocalSearchPagesFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type LocalSearchPagesGroupConnection_maxArgs = {
  field: LocalSearchPagesFieldSelector;
};


type LocalSearchPagesGroupConnection_minArgs = {
  field: LocalSearchPagesFieldSelector;
};


type LocalSearchPagesGroupConnection_sumArgs = {
  field: LocalSearchPagesFieldSelector;
};

type LocalSearchPagesSortInput = {
  readonly children: InputMaybe<NodeSortInput>;
  readonly engine: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly index: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly name: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly publicIndexURL: InputMaybe<SortOrderEnum>;
  readonly publicStoreURL: InputMaybe<SortOrderEnum>;
  readonly store: InputMaybe<SortOrderEnum>;
};

type Mdx = Node & {
  readonly body: Maybe<Scalars['String']>;
  readonly children: ReadonlyArray<Node>;
  readonly excerpt: Maybe<Scalars['String']>;
  readonly frontmatter: Maybe<MdxFrontmatter>;
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly parent: Maybe<Node>;
  readonly tableOfContents: Maybe<Scalars['JSON']>;
};


type Mdx_excerptArgs = {
  pruneLength?: InputMaybe<Scalars['Int']>;
};


type Mdx_tableOfContentsArgs = {
  maxDepth: InputMaybe<Scalars['Int']>;
};

type MdxConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<MdxEdge>;
  readonly group: ReadonlyArray<MdxGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<Mdx>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type MdxConnection_distinctArgs = {
  field: MdxFieldSelector;
};


type MdxConnection_groupArgs = {
  field: MdxFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type MdxConnection_maxArgs = {
  field: MdxFieldSelector;
};


type MdxConnection_minArgs = {
  field: MdxFieldSelector;
};


type MdxConnection_sumArgs = {
  field: MdxFieldSelector;
};

type MdxEdge = {
  readonly next: Maybe<Mdx>;
  readonly node: Mdx;
  readonly previous: Maybe<Mdx>;
};

type MdxFieldSelector = {
  readonly body: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly excerpt: InputMaybe<FieldSelectorEnum>;
  readonly frontmatter: InputMaybe<MdxFrontmatterFieldSelector>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly tableOfContents: InputMaybe<FieldSelectorEnum>;
};

type MdxFilterInput = {
  readonly body: InputMaybe<StringQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly excerpt: InputMaybe<StringQueryOperatorInput>;
  readonly frontmatter: InputMaybe<MdxFrontmatterFilterInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly tableOfContents: InputMaybe<JSONQueryOperatorInput>;
};

type MdxFilterListInput = {
  readonly elemMatch: InputMaybe<MdxFilterInput>;
};

type MdxFrontmatter = {
  readonly slug: Maybe<Scalars['String']>;
};

type MdxFrontmatterFieldSelector = {
  readonly slug: InputMaybe<FieldSelectorEnum>;
};

type MdxFrontmatterFilterInput = {
  readonly slug: InputMaybe<StringQueryOperatorInput>;
};

type MdxFrontmatterSortInput = {
  readonly slug: InputMaybe<SortOrderEnum>;
};

type MdxGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<MdxEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<MdxGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<Mdx>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type MdxGroupConnection_distinctArgs = {
  field: MdxFieldSelector;
};


type MdxGroupConnection_groupArgs = {
  field: MdxFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type MdxGroupConnection_maxArgs = {
  field: MdxFieldSelector;
};


type MdxGroupConnection_minArgs = {
  field: MdxFieldSelector;
};


type MdxGroupConnection_sumArgs = {
  field: MdxFieldSelector;
};

type MdxSortInput = {
  readonly body: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly excerpt: InputMaybe<SortOrderEnum>;
  readonly frontmatter: InputMaybe<MdxFrontmatterSortInput>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly tableOfContents: InputMaybe<SortOrderEnum>;
};

/** Node Interface */
type Node = {
  readonly children: ReadonlyArray<Node>;
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly parent: Maybe<Node>;
};

type NodeFieldSelector = {
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly parent: InputMaybe<NodeFieldSelector>;
};

type NodeFilterInput = {
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
};

type NodeFilterListInput = {
  readonly elemMatch: InputMaybe<NodeFilterInput>;
};

type NodeSortInput = {
  readonly children: InputMaybe<NodeSortInput>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly parent: InputMaybe<NodeSortInput>;
};

type PNGOptions = {
  readonly compressionSpeed: InputMaybe<Scalars['Int']>;
  readonly quality: InputMaybe<Scalars['Int']>;
};

type PageInfo = {
  readonly currentPage: Scalars['Int'];
  readonly hasNextPage: Scalars['Boolean'];
  readonly hasPreviousPage: Scalars['Boolean'];
  readonly itemCount: Scalars['Int'];
  readonly pageCount: Scalars['Int'];
  readonly perPage: Maybe<Scalars['Int']>;
  readonly totalCount: Scalars['Int'];
};

type Potrace = {
  readonly alphaMax: InputMaybe<Scalars['Float']>;
  readonly background: InputMaybe<Scalars['String']>;
  readonly blackOnWhite: InputMaybe<Scalars['Boolean']>;
  readonly color: InputMaybe<Scalars['String']>;
  readonly optCurve: InputMaybe<Scalars['Boolean']>;
  readonly optTolerance: InputMaybe<Scalars['Float']>;
  readonly threshold: InputMaybe<Scalars['Int']>;
  readonly turdSize: InputMaybe<Scalars['Float']>;
  readonly turnPolicy: InputMaybe<PotraceTurnPolicy>;
};

type PotraceTurnPolicy =
  | 'black'
  | 'left'
  | 'majority'
  | 'minority'
  | 'right'
  | 'white';

type Query = {
  readonly allComponentMetaJson: componentMetaJsonConnection;
  readonly allDirectory: DirectoryConnection;
  readonly allFile: FileConnection;
  readonly allImageSharp: ImageSharpConnection;
  readonly allLocalSearchPages: LocalSearchPagesConnection;
  readonly allMdx: MdxConnection;
  readonly allPrimitiveMetaJson: primitiveMetaJsonConnection;
  readonly allSite: SiteConnection;
  readonly allSiteBuildMetadata: SiteBuildMetadataConnection;
  readonly allSiteFunction: SiteFunctionConnection;
  readonly allSitePage: SitePageConnection;
  readonly allSitePlugin: SitePluginConnection;
  readonly componentMetaJson: Maybe<componentMetaJson>;
  readonly directory: Maybe<Directory>;
  readonly file: Maybe<File>;
  readonly imageSharp: Maybe<ImageSharp>;
  readonly localSearchPages: Maybe<LocalSearchPages>;
  readonly mdx: Maybe<Mdx>;
  readonly primitiveMetaJson: Maybe<primitiveMetaJson>;
  readonly site: Maybe<Site>;
  readonly siteBuildMetadata: Maybe<SiteBuildMetadata>;
  readonly siteFunction: Maybe<SiteFunction>;
  readonly sitePage: Maybe<SitePage>;
  readonly sitePlugin: Maybe<SitePlugin>;
};


type Query_allComponentMetaJsonArgs = {
  filter: InputMaybe<componentMetaJsonFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<componentMetaJsonSortInput>>>;
};


type Query_allDirectoryArgs = {
  filter: InputMaybe<DirectoryFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<DirectorySortInput>>>;
};


type Query_allFileArgs = {
  filter: InputMaybe<FileFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<FileSortInput>>>;
};


type Query_allImageSharpArgs = {
  filter: InputMaybe<ImageSharpFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<ImageSharpSortInput>>>;
};


type Query_allLocalSearchPagesArgs = {
  filter: InputMaybe<LocalSearchPagesFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<LocalSearchPagesSortInput>>>;
};


type Query_allMdxArgs = {
  filter: InputMaybe<MdxFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<MdxSortInput>>>;
};


type Query_allPrimitiveMetaJsonArgs = {
  filter: InputMaybe<primitiveMetaJsonFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<primitiveMetaJsonSortInput>>>;
};


type Query_allSiteArgs = {
  filter: InputMaybe<SiteFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<SiteSortInput>>>;
};


type Query_allSiteBuildMetadataArgs = {
  filter: InputMaybe<SiteBuildMetadataFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<SiteBuildMetadataSortInput>>>;
};


type Query_allSiteFunctionArgs = {
  filter: InputMaybe<SiteFunctionFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<SiteFunctionSortInput>>>;
};


type Query_allSitePageArgs = {
  filter: InputMaybe<SitePageFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<SitePageSortInput>>>;
};


type Query_allSitePluginArgs = {
  filter: InputMaybe<SitePluginFilterInput>;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<ReadonlyArray<InputMaybe<SitePluginSortInput>>>;
};


type Query_componentMetaJsonArgs = {
  _schema: InputMaybe<StringQueryOperatorInput>;
  alias: InputMaybe<StringQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  description: InputMaybe<StringQueryOperatorInput>;
  group: InputMaybe<StringQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  name: InputMaybe<StringQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  platform: InputMaybe<componentMetaJsonPlatformFilterInput>;
  primitive: InputMaybe<FileFilterInput>;
  thumbnail: InputMaybe<FileFilterInput>;
};


type Query_directoryArgs = {
  absolutePath: InputMaybe<StringQueryOperatorInput>;
  accessTime: InputMaybe<DateQueryOperatorInput>;
  atime: InputMaybe<DateQueryOperatorInput>;
  atimeMs: InputMaybe<FloatQueryOperatorInput>;
  base: InputMaybe<StringQueryOperatorInput>;
  birthTime: InputMaybe<DateQueryOperatorInput>;
  birthtime: InputMaybe<DateQueryOperatorInput>;
  birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
  changeTime: InputMaybe<DateQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  ctime: InputMaybe<DateQueryOperatorInput>;
  ctimeMs: InputMaybe<FloatQueryOperatorInput>;
  dev: InputMaybe<IntQueryOperatorInput>;
  dir: InputMaybe<StringQueryOperatorInput>;
  ext: InputMaybe<StringQueryOperatorInput>;
  extension: InputMaybe<StringQueryOperatorInput>;
  gid: InputMaybe<IntQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  ino: InputMaybe<FloatQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  mode: InputMaybe<IntQueryOperatorInput>;
  modifiedTime: InputMaybe<DateQueryOperatorInput>;
  mtime: InputMaybe<DateQueryOperatorInput>;
  mtimeMs: InputMaybe<FloatQueryOperatorInput>;
  name: InputMaybe<StringQueryOperatorInput>;
  nlink: InputMaybe<IntQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  prettySize: InputMaybe<StringQueryOperatorInput>;
  rdev: InputMaybe<IntQueryOperatorInput>;
  relativeDirectory: InputMaybe<StringQueryOperatorInput>;
  relativePath: InputMaybe<StringQueryOperatorInput>;
  root: InputMaybe<StringQueryOperatorInput>;
  size: InputMaybe<IntQueryOperatorInput>;
  sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
  uid: InputMaybe<IntQueryOperatorInput>;
};


type Query_fileArgs = {
  absolutePath: InputMaybe<StringQueryOperatorInput>;
  accessTime: InputMaybe<DateQueryOperatorInput>;
  atime: InputMaybe<DateQueryOperatorInput>;
  atimeMs: InputMaybe<FloatQueryOperatorInput>;
  base: InputMaybe<StringQueryOperatorInput>;
  birthTime: InputMaybe<DateQueryOperatorInput>;
  birthtime: InputMaybe<DateQueryOperatorInput>;
  birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
  blksize: InputMaybe<IntQueryOperatorInput>;
  blocks: InputMaybe<IntQueryOperatorInput>;
  changeTime: InputMaybe<DateQueryOperatorInput>;
  childComponentMetaJson: InputMaybe<componentMetaJsonFilterInput>;
  childImageSharp: InputMaybe<ImageSharpFilterInput>;
  childMdx: InputMaybe<MdxFilterInput>;
  childPrimitiveMetaJson: InputMaybe<primitiveMetaJsonFilterInput>;
  children: InputMaybe<NodeFilterListInput>;
  childrenComponentMetaJson: InputMaybe<componentMetaJsonFilterListInput>;
  childrenImageSharp: InputMaybe<ImageSharpFilterListInput>;
  childrenMdx: InputMaybe<MdxFilterListInput>;
  childrenPrimitiveMetaJson: InputMaybe<primitiveMetaJsonFilterListInput>;
  ctime: InputMaybe<DateQueryOperatorInput>;
  ctimeMs: InputMaybe<FloatQueryOperatorInput>;
  dev: InputMaybe<IntQueryOperatorInput>;
  dir: InputMaybe<StringQueryOperatorInput>;
  ext: InputMaybe<StringQueryOperatorInput>;
  extension: InputMaybe<StringQueryOperatorInput>;
  gid: InputMaybe<IntQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  ino: InputMaybe<FloatQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  mode: InputMaybe<IntQueryOperatorInput>;
  modifiedTime: InputMaybe<DateQueryOperatorInput>;
  mtime: InputMaybe<DateQueryOperatorInput>;
  mtimeMs: InputMaybe<FloatQueryOperatorInput>;
  name: InputMaybe<StringQueryOperatorInput>;
  nlink: InputMaybe<IntQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  prettySize: InputMaybe<StringQueryOperatorInput>;
  publicURL: InputMaybe<StringQueryOperatorInput>;
  rdev: InputMaybe<IntQueryOperatorInput>;
  relativeDirectory: InputMaybe<StringQueryOperatorInput>;
  relativePath: InputMaybe<StringQueryOperatorInput>;
  root: InputMaybe<StringQueryOperatorInput>;
  size: InputMaybe<IntQueryOperatorInput>;
  sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
  uid: InputMaybe<IntQueryOperatorInput>;
};


type Query_imageSharpArgs = {
  children: InputMaybe<NodeFilterListInput>;
  fixed: InputMaybe<ImageSharpFixedFilterInput>;
  fluid: InputMaybe<ImageSharpFluidFilterInput>;
  gatsbyImageData: InputMaybe<GatsbyImageDataQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  original: InputMaybe<ImageSharpOriginalFilterInput>;
  parent: InputMaybe<NodeFilterInput>;
  resize: InputMaybe<ImageSharpResizeFilterInput>;
};


type Query_localSearchPagesArgs = {
  children: InputMaybe<NodeFilterListInput>;
  engine: InputMaybe<StringQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  index: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  name: InputMaybe<StringQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  publicIndexURL: InputMaybe<StringQueryOperatorInput>;
  publicStoreURL: InputMaybe<StringQueryOperatorInput>;
  store: InputMaybe<JSONQueryOperatorInput>;
};


type Query_mdxArgs = {
  body: InputMaybe<StringQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  excerpt: InputMaybe<StringQueryOperatorInput>;
  frontmatter: InputMaybe<MdxFrontmatterFilterInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  parent: InputMaybe<NodeFilterInput>;
  tableOfContents: InputMaybe<JSONQueryOperatorInput>;
};


type Query_primitiveMetaJsonArgs = {
  _schema: InputMaybe<StringQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  description: InputMaybe<StringQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  name: InputMaybe<StringQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  primitive: InputMaybe<FileFilterInput>;
  thumbnail: InputMaybe<FileFilterInput>;
};


type Query_siteArgs = {
  buildTime: InputMaybe<DateQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  flags: InputMaybe<SiteFlagsFilterInput>;
  graphqlTypegen: InputMaybe<SiteGraphqlTypegenFilterInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  jsxRuntime: InputMaybe<StringQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  pathPrefix: InputMaybe<StringQueryOperatorInput>;
  polyfill: InputMaybe<BooleanQueryOperatorInput>;
  siteMetadata: InputMaybe<SiteSiteMetadataFilterInput>;
  trailingSlash: InputMaybe<StringQueryOperatorInput>;
};


type Query_siteBuildMetadataArgs = {
  buildTime: InputMaybe<DateQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  parent: InputMaybe<NodeFilterInput>;
};


type Query_siteFunctionArgs = {
  absoluteCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  functionRoute: InputMaybe<StringQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  matchPath: InputMaybe<StringQueryOperatorInput>;
  originalAbsoluteFilePath: InputMaybe<StringQueryOperatorInput>;
  originalRelativeFilePath: InputMaybe<StringQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  pluginName: InputMaybe<StringQueryOperatorInput>;
  relativeCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
};


type Query_sitePageArgs = {
  children: InputMaybe<NodeFilterListInput>;
  component: InputMaybe<StringQueryOperatorInput>;
  componentChunkName: InputMaybe<StringQueryOperatorInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  internalComponentName: InputMaybe<StringQueryOperatorInput>;
  matchPath: InputMaybe<StringQueryOperatorInput>;
  pageContext: InputMaybe<JSONQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  path: InputMaybe<StringQueryOperatorInput>;
  pluginCreator: InputMaybe<SitePluginFilterInput>;
};


type Query_sitePluginArgs = {
  browserAPIs: InputMaybe<StringQueryOperatorInput>;
  children: InputMaybe<NodeFilterListInput>;
  id: InputMaybe<StringQueryOperatorInput>;
  internal: InputMaybe<InternalFilterInput>;
  name: InputMaybe<StringQueryOperatorInput>;
  nodeAPIs: InputMaybe<StringQueryOperatorInput>;
  packageJson: InputMaybe<JSONQueryOperatorInput>;
  parent: InputMaybe<NodeFilterInput>;
  pluginFilepath: InputMaybe<StringQueryOperatorInput>;
  pluginOptions: InputMaybe<JSONQueryOperatorInput>;
  resolve: InputMaybe<StringQueryOperatorInput>;
  ssrAPIs: InputMaybe<StringQueryOperatorInput>;
  version: InputMaybe<StringQueryOperatorInput>;
};

type Site = Node & {
  readonly buildTime: Maybe<Scalars['Date']>;
  readonly children: ReadonlyArray<Node>;
  readonly flags: Maybe<SiteFlags>;
  readonly graphqlTypegen: Maybe<SiteGraphqlTypegen>;
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly jsxRuntime: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly pathPrefix: Maybe<Scalars['String']>;
  readonly polyfill: Maybe<Scalars['Boolean']>;
  readonly siteMetadata: Maybe<SiteSiteMetadata>;
  readonly trailingSlash: Maybe<Scalars['String']>;
};


type Site_buildTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};

type SiteBuildMetadata = Node & {
  readonly buildTime: Maybe<Scalars['Date']>;
  readonly children: ReadonlyArray<Node>;
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly parent: Maybe<Node>;
};


type SiteBuildMetadata_buildTimeArgs = {
  difference: InputMaybe<Scalars['String']>;
  formatString: InputMaybe<Scalars['String']>;
  fromNow: InputMaybe<Scalars['Boolean']>;
  locale: InputMaybe<Scalars['String']>;
};

type SiteBuildMetadataConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
  readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SiteBuildMetadata>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SiteBuildMetadataConnection_distinctArgs = {
  field: SiteBuildMetadataFieldSelector;
};


type SiteBuildMetadataConnection_groupArgs = {
  field: SiteBuildMetadataFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SiteBuildMetadataConnection_maxArgs = {
  field: SiteBuildMetadataFieldSelector;
};


type SiteBuildMetadataConnection_minArgs = {
  field: SiteBuildMetadataFieldSelector;
};


type SiteBuildMetadataConnection_sumArgs = {
  field: SiteBuildMetadataFieldSelector;
};

type SiteBuildMetadataEdge = {
  readonly next: Maybe<SiteBuildMetadata>;
  readonly node: SiteBuildMetadata;
  readonly previous: Maybe<SiteBuildMetadata>;
};

type SiteBuildMetadataFieldSelector = {
  readonly buildTime: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly parent: InputMaybe<NodeFieldSelector>;
};

type SiteBuildMetadataFilterInput = {
  readonly buildTime: InputMaybe<DateQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
};

type SiteBuildMetadataGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SiteBuildMetadata>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SiteBuildMetadataGroupConnection_distinctArgs = {
  field: SiteBuildMetadataFieldSelector;
};


type SiteBuildMetadataGroupConnection_groupArgs = {
  field: SiteBuildMetadataFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SiteBuildMetadataGroupConnection_maxArgs = {
  field: SiteBuildMetadataFieldSelector;
};


type SiteBuildMetadataGroupConnection_minArgs = {
  field: SiteBuildMetadataFieldSelector;
};


type SiteBuildMetadataGroupConnection_sumArgs = {
  field: SiteBuildMetadataFieldSelector;
};

type SiteBuildMetadataSortInput = {
  readonly buildTime: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly parent: InputMaybe<NodeSortInput>;
};

type SiteConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SiteEdge>;
  readonly group: ReadonlyArray<SiteGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<Site>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SiteConnection_distinctArgs = {
  field: SiteFieldSelector;
};


type SiteConnection_groupArgs = {
  field: SiteFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SiteConnection_maxArgs = {
  field: SiteFieldSelector;
};


type SiteConnection_minArgs = {
  field: SiteFieldSelector;
};


type SiteConnection_sumArgs = {
  field: SiteFieldSelector;
};

type SiteEdge = {
  readonly next: Maybe<Site>;
  readonly node: Site;
  readonly previous: Maybe<Site>;
};

type SiteFieldSelector = {
  readonly buildTime: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly flags: InputMaybe<SiteFlagsFieldSelector>;
  readonly graphqlTypegen: InputMaybe<SiteGraphqlTypegenFieldSelector>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly jsxRuntime: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly pathPrefix: InputMaybe<FieldSelectorEnum>;
  readonly polyfill: InputMaybe<FieldSelectorEnum>;
  readonly siteMetadata: InputMaybe<SiteSiteMetadataFieldSelector>;
  readonly trailingSlash: InputMaybe<FieldSelectorEnum>;
};

type SiteFilterInput = {
  readonly buildTime: InputMaybe<DateQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly flags: InputMaybe<SiteFlagsFilterInput>;
  readonly graphqlTypegen: InputMaybe<SiteGraphqlTypegenFilterInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly jsxRuntime: InputMaybe<StringQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly pathPrefix: InputMaybe<StringQueryOperatorInput>;
  readonly polyfill: InputMaybe<BooleanQueryOperatorInput>;
  readonly siteMetadata: InputMaybe<SiteSiteMetadataFilterInput>;
  readonly trailingSlash: InputMaybe<StringQueryOperatorInput>;
};

type SiteFlags = {
  readonly DEV_SSR: Maybe<Scalars['Boolean']>;
};

type SiteFlagsFieldSelector = {
  readonly DEV_SSR: InputMaybe<FieldSelectorEnum>;
};

type SiteFlagsFilterInput = {
  readonly DEV_SSR: InputMaybe<BooleanQueryOperatorInput>;
};

type SiteFlagsSortInput = {
  readonly DEV_SSR: InputMaybe<SortOrderEnum>;
};

type SiteFunction = Node & {
  readonly absoluteCompiledFilePath: Scalars['String'];
  readonly children: ReadonlyArray<Node>;
  readonly functionRoute: Scalars['String'];
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly matchPath: Maybe<Scalars['String']>;
  readonly originalAbsoluteFilePath: Scalars['String'];
  readonly originalRelativeFilePath: Scalars['String'];
  readonly parent: Maybe<Node>;
  readonly pluginName: Scalars['String'];
  readonly relativeCompiledFilePath: Scalars['String'];
};

type SiteFunctionConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SiteFunctionEdge>;
  readonly group: ReadonlyArray<SiteFunctionGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SiteFunction>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SiteFunctionConnection_distinctArgs = {
  field: SiteFunctionFieldSelector;
};


type SiteFunctionConnection_groupArgs = {
  field: SiteFunctionFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SiteFunctionConnection_maxArgs = {
  field: SiteFunctionFieldSelector;
};


type SiteFunctionConnection_minArgs = {
  field: SiteFunctionFieldSelector;
};


type SiteFunctionConnection_sumArgs = {
  field: SiteFunctionFieldSelector;
};

type SiteFunctionEdge = {
  readonly next: Maybe<SiteFunction>;
  readonly node: SiteFunction;
  readonly previous: Maybe<SiteFunction>;
};

type SiteFunctionFieldSelector = {
  readonly absoluteCompiledFilePath: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly functionRoute: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly matchPath: InputMaybe<FieldSelectorEnum>;
  readonly originalAbsoluteFilePath: InputMaybe<FieldSelectorEnum>;
  readonly originalRelativeFilePath: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly pluginName: InputMaybe<FieldSelectorEnum>;
  readonly relativeCompiledFilePath: InputMaybe<FieldSelectorEnum>;
};

type SiteFunctionFilterInput = {
  readonly absoluteCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly functionRoute: InputMaybe<StringQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly matchPath: InputMaybe<StringQueryOperatorInput>;
  readonly originalAbsoluteFilePath: InputMaybe<StringQueryOperatorInput>;
  readonly originalRelativeFilePath: InputMaybe<StringQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly pluginName: InputMaybe<StringQueryOperatorInput>;
  readonly relativeCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
};

type SiteFunctionGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SiteFunctionEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<SiteFunctionGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SiteFunction>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SiteFunctionGroupConnection_distinctArgs = {
  field: SiteFunctionFieldSelector;
};


type SiteFunctionGroupConnection_groupArgs = {
  field: SiteFunctionFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SiteFunctionGroupConnection_maxArgs = {
  field: SiteFunctionFieldSelector;
};


type SiteFunctionGroupConnection_minArgs = {
  field: SiteFunctionFieldSelector;
};


type SiteFunctionGroupConnection_sumArgs = {
  field: SiteFunctionFieldSelector;
};

type SiteFunctionSortInput = {
  readonly absoluteCompiledFilePath: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly functionRoute: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly matchPath: InputMaybe<SortOrderEnum>;
  readonly originalAbsoluteFilePath: InputMaybe<SortOrderEnum>;
  readonly originalRelativeFilePath: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly pluginName: InputMaybe<SortOrderEnum>;
  readonly relativeCompiledFilePath: InputMaybe<SortOrderEnum>;
};

type SiteGraphqlTypegen = {
  readonly documentSearchPaths: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly generateOnBuild: Maybe<Scalars['Boolean']>;
  readonly typesOutputPath: Maybe<Scalars['String']>;
};

type SiteGraphqlTypegenFieldSelector = {
  readonly documentSearchPaths: InputMaybe<FieldSelectorEnum>;
  readonly generateOnBuild: InputMaybe<FieldSelectorEnum>;
  readonly typesOutputPath: InputMaybe<FieldSelectorEnum>;
};

type SiteGraphqlTypegenFilterInput = {
  readonly documentSearchPaths: InputMaybe<StringQueryOperatorInput>;
  readonly generateOnBuild: InputMaybe<BooleanQueryOperatorInput>;
  readonly typesOutputPath: InputMaybe<StringQueryOperatorInput>;
};

type SiteGraphqlTypegenSortInput = {
  readonly documentSearchPaths: InputMaybe<SortOrderEnum>;
  readonly generateOnBuild: InputMaybe<SortOrderEnum>;
  readonly typesOutputPath: InputMaybe<SortOrderEnum>;
};

type SiteGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SiteEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<SiteGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<Site>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SiteGroupConnection_distinctArgs = {
  field: SiteFieldSelector;
};


type SiteGroupConnection_groupArgs = {
  field: SiteFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SiteGroupConnection_maxArgs = {
  field: SiteFieldSelector;
};


type SiteGroupConnection_minArgs = {
  field: SiteFieldSelector;
};


type SiteGroupConnection_sumArgs = {
  field: SiteFieldSelector;
};

type SitePage = Node & {
  readonly children: ReadonlyArray<Node>;
  readonly component: Scalars['String'];
  readonly componentChunkName: Scalars['String'];
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly internalComponentName: Scalars['String'];
  readonly matchPath: Maybe<Scalars['String']>;
  readonly pageContext: Maybe<Scalars['JSON']>;
  readonly parent: Maybe<Node>;
  readonly path: Scalars['String'];
  readonly pluginCreator: Maybe<SitePlugin>;
};

type SitePageConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SitePageEdge>;
  readonly group: ReadonlyArray<SitePageGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SitePage>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SitePageConnection_distinctArgs = {
  field: SitePageFieldSelector;
};


type SitePageConnection_groupArgs = {
  field: SitePageFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SitePageConnection_maxArgs = {
  field: SitePageFieldSelector;
};


type SitePageConnection_minArgs = {
  field: SitePageFieldSelector;
};


type SitePageConnection_sumArgs = {
  field: SitePageFieldSelector;
};

type SitePageEdge = {
  readonly next: Maybe<SitePage>;
  readonly node: SitePage;
  readonly previous: Maybe<SitePage>;
};

type SitePageFieldSelector = {
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly component: InputMaybe<FieldSelectorEnum>;
  readonly componentChunkName: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly internalComponentName: InputMaybe<FieldSelectorEnum>;
  readonly matchPath: InputMaybe<FieldSelectorEnum>;
  readonly pageContext: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly path: InputMaybe<FieldSelectorEnum>;
  readonly pluginCreator: InputMaybe<SitePluginFieldSelector>;
};

type SitePageFilterInput = {
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly component: InputMaybe<StringQueryOperatorInput>;
  readonly componentChunkName: InputMaybe<StringQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly internalComponentName: InputMaybe<StringQueryOperatorInput>;
  readonly matchPath: InputMaybe<StringQueryOperatorInput>;
  readonly pageContext: InputMaybe<JSONQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly path: InputMaybe<StringQueryOperatorInput>;
  readonly pluginCreator: InputMaybe<SitePluginFilterInput>;
};

type SitePageGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SitePageEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<SitePageGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SitePage>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SitePageGroupConnection_distinctArgs = {
  field: SitePageFieldSelector;
};


type SitePageGroupConnection_groupArgs = {
  field: SitePageFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SitePageGroupConnection_maxArgs = {
  field: SitePageFieldSelector;
};


type SitePageGroupConnection_minArgs = {
  field: SitePageFieldSelector;
};


type SitePageGroupConnection_sumArgs = {
  field: SitePageFieldSelector;
};

type SitePageSortInput = {
  readonly children: InputMaybe<NodeSortInput>;
  readonly component: InputMaybe<SortOrderEnum>;
  readonly componentChunkName: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly internalComponentName: InputMaybe<SortOrderEnum>;
  readonly matchPath: InputMaybe<SortOrderEnum>;
  readonly pageContext: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly path: InputMaybe<SortOrderEnum>;
  readonly pluginCreator: InputMaybe<SitePluginSortInput>;
};

type SitePlugin = Node & {
  readonly browserAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly children: ReadonlyArray<Node>;
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly name: Maybe<Scalars['String']>;
  readonly nodeAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly packageJson: Maybe<Scalars['JSON']>;
  readonly parent: Maybe<Node>;
  readonly pluginFilepath: Maybe<Scalars['String']>;
  readonly pluginOptions: Maybe<Scalars['JSON']>;
  readonly resolve: Maybe<Scalars['String']>;
  readonly ssrAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly version: Maybe<Scalars['String']>;
};

type SitePluginConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SitePluginEdge>;
  readonly group: ReadonlyArray<SitePluginGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SitePlugin>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SitePluginConnection_distinctArgs = {
  field: SitePluginFieldSelector;
};


type SitePluginConnection_groupArgs = {
  field: SitePluginFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SitePluginConnection_maxArgs = {
  field: SitePluginFieldSelector;
};


type SitePluginConnection_minArgs = {
  field: SitePluginFieldSelector;
};


type SitePluginConnection_sumArgs = {
  field: SitePluginFieldSelector;
};

type SitePluginEdge = {
  readonly next: Maybe<SitePlugin>;
  readonly node: SitePlugin;
  readonly previous: Maybe<SitePlugin>;
};

type SitePluginFieldSelector = {
  readonly browserAPIs: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly name: InputMaybe<FieldSelectorEnum>;
  readonly nodeAPIs: InputMaybe<FieldSelectorEnum>;
  readonly packageJson: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly pluginFilepath: InputMaybe<FieldSelectorEnum>;
  readonly pluginOptions: InputMaybe<FieldSelectorEnum>;
  readonly resolve: InputMaybe<FieldSelectorEnum>;
  readonly ssrAPIs: InputMaybe<FieldSelectorEnum>;
  readonly version: InputMaybe<FieldSelectorEnum>;
};

type SitePluginFilterInput = {
  readonly browserAPIs: InputMaybe<StringQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly name: InputMaybe<StringQueryOperatorInput>;
  readonly nodeAPIs: InputMaybe<StringQueryOperatorInput>;
  readonly packageJson: InputMaybe<JSONQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly pluginFilepath: InputMaybe<StringQueryOperatorInput>;
  readonly pluginOptions: InputMaybe<JSONQueryOperatorInput>;
  readonly resolve: InputMaybe<StringQueryOperatorInput>;
  readonly ssrAPIs: InputMaybe<StringQueryOperatorInput>;
  readonly version: InputMaybe<StringQueryOperatorInput>;
};

type SitePluginGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<SitePluginEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<SitePluginGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<SitePlugin>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type SitePluginGroupConnection_distinctArgs = {
  field: SitePluginFieldSelector;
};


type SitePluginGroupConnection_groupArgs = {
  field: SitePluginFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type SitePluginGroupConnection_maxArgs = {
  field: SitePluginFieldSelector;
};


type SitePluginGroupConnection_minArgs = {
  field: SitePluginFieldSelector;
};


type SitePluginGroupConnection_sumArgs = {
  field: SitePluginFieldSelector;
};

type SitePluginSortInput = {
  readonly browserAPIs: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly name: InputMaybe<SortOrderEnum>;
  readonly nodeAPIs: InputMaybe<SortOrderEnum>;
  readonly packageJson: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly pluginFilepath: InputMaybe<SortOrderEnum>;
  readonly pluginOptions: InputMaybe<SortOrderEnum>;
  readonly resolve: InputMaybe<SortOrderEnum>;
  readonly ssrAPIs: InputMaybe<SortOrderEnum>;
  readonly version: InputMaybe<SortOrderEnum>;
};

type SiteSiteMetadata = {
  readonly description: Maybe<Scalars['String']>;
  readonly siteUrl: Maybe<Scalars['String']>;
  readonly title: Maybe<Scalars['String']>;
};

type SiteSiteMetadataFieldSelector = {
  readonly description: InputMaybe<FieldSelectorEnum>;
  readonly siteUrl: InputMaybe<FieldSelectorEnum>;
  readonly title: InputMaybe<FieldSelectorEnum>;
};

type SiteSiteMetadataFilterInput = {
  readonly description: InputMaybe<StringQueryOperatorInput>;
  readonly siteUrl: InputMaybe<StringQueryOperatorInput>;
  readonly title: InputMaybe<StringQueryOperatorInput>;
};

type SiteSiteMetadataSortInput = {
  readonly description: InputMaybe<SortOrderEnum>;
  readonly siteUrl: InputMaybe<SortOrderEnum>;
  readonly title: InputMaybe<SortOrderEnum>;
};

type SiteSortInput = {
  readonly buildTime: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly flags: InputMaybe<SiteFlagsSortInput>;
  readonly graphqlTypegen: InputMaybe<SiteGraphqlTypegenSortInput>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly jsxRuntime: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly pathPrefix: InputMaybe<SortOrderEnum>;
  readonly polyfill: InputMaybe<SortOrderEnum>;
  readonly siteMetadata: InputMaybe<SiteSiteMetadataSortInput>;
  readonly trailingSlash: InputMaybe<SortOrderEnum>;
};

type SortOrderEnum =
  | 'ASC'
  | 'DESC';

type StringQueryOperatorInput = {
  readonly eq: InputMaybe<Scalars['String']>;
  readonly glob: InputMaybe<Scalars['String']>;
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars['String']>>>;
  readonly ne: InputMaybe<Scalars['String']>;
  readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars['String']>>>;
  readonly regex: InputMaybe<Scalars['String']>;
};

type TransformOptions = {
  readonly cropFocus: InputMaybe<ImageCropFocus>;
  readonly duotone: InputMaybe<DuotoneGradient>;
  readonly fit: InputMaybe<ImageFit>;
  readonly grayscale: InputMaybe<Scalars['Boolean']>;
  readonly rotate: InputMaybe<Scalars['Int']>;
  readonly trim: InputMaybe<Scalars['Float']>;
};

type WebPOptions = {
  readonly quality: InputMaybe<Scalars['Int']>;
};

type componentMetaJson = Node & {
  readonly _schema: Maybe<Scalars['String']>;
  readonly alias: Maybe<Scalars['String']>;
  readonly children: ReadonlyArray<Node>;
  readonly description: Maybe<Scalars['String']>;
  readonly group: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly name: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly platform: Maybe<componentMetaJsonPlatform>;
  readonly primitive: Maybe<File>;
  readonly thumbnail: Maybe<File>;
};

type componentMetaJsonConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<componentMetaJsonEdge>;
  readonly group: ReadonlyArray<componentMetaJsonGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<componentMetaJson>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type componentMetaJsonConnection_distinctArgs = {
  field: componentMetaJsonFieldSelector;
};


type componentMetaJsonConnection_groupArgs = {
  field: componentMetaJsonFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type componentMetaJsonConnection_maxArgs = {
  field: componentMetaJsonFieldSelector;
};


type componentMetaJsonConnection_minArgs = {
  field: componentMetaJsonFieldSelector;
};


type componentMetaJsonConnection_sumArgs = {
  field: componentMetaJsonFieldSelector;
};

type componentMetaJsonEdge = {
  readonly next: Maybe<componentMetaJson>;
  readonly node: componentMetaJson;
  readonly previous: Maybe<componentMetaJson>;
};

type componentMetaJsonFieldSelector = {
  readonly _schema: InputMaybe<FieldSelectorEnum>;
  readonly alias: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly description: InputMaybe<FieldSelectorEnum>;
  readonly group: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly name: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly platform: InputMaybe<componentMetaJsonPlatformFieldSelector>;
  readonly primitive: InputMaybe<FileFieldSelector>;
  readonly thumbnail: InputMaybe<FileFieldSelector>;
};

type componentMetaJsonFilterInput = {
  readonly _schema: InputMaybe<StringQueryOperatorInput>;
  readonly alias: InputMaybe<StringQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly description: InputMaybe<StringQueryOperatorInput>;
  readonly group: InputMaybe<StringQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly name: InputMaybe<StringQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly platform: InputMaybe<componentMetaJsonPlatformFilterInput>;
  readonly primitive: InputMaybe<FileFilterInput>;
  readonly thumbnail: InputMaybe<FileFilterInput>;
};

type componentMetaJsonFilterListInput = {
  readonly elemMatch: InputMaybe<componentMetaJsonFilterInput>;
};

type componentMetaJsonGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<componentMetaJsonEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<componentMetaJsonGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<componentMetaJson>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type componentMetaJsonGroupConnection_distinctArgs = {
  field: componentMetaJsonFieldSelector;
};


type componentMetaJsonGroupConnection_groupArgs = {
  field: componentMetaJsonFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type componentMetaJsonGroupConnection_maxArgs = {
  field: componentMetaJsonFieldSelector;
};


type componentMetaJsonGroupConnection_minArgs = {
  field: componentMetaJsonFieldSelector;
};


type componentMetaJsonGroupConnection_sumArgs = {
  field: componentMetaJsonFieldSelector;
};

type componentMetaJsonPlatform = {
  readonly android: Maybe<componentMetaJsonPlatformAndroid>;
  readonly docs: Maybe<componentMetaJsonPlatformDocs>;
  readonly figma: Maybe<componentMetaJsonPlatformFigma>;
  readonly ios: Maybe<componentMetaJsonPlatformIos>;
  readonly react: Maybe<componentMetaJsonPlatformReact>;
};

type componentMetaJsonPlatformAndroid = {
  readonly path: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
};

type componentMetaJsonPlatformAndroidFieldSelector = {
  readonly path: InputMaybe<FieldSelectorEnum>;
  readonly status: InputMaybe<FieldSelectorEnum>;
};

type componentMetaJsonPlatformAndroidFilterInput = {
  readonly path: InputMaybe<StringQueryOperatorInput>;
  readonly status: InputMaybe<StringQueryOperatorInput>;
};

type componentMetaJsonPlatformAndroidSortInput = {
  readonly path: InputMaybe<SortOrderEnum>;
  readonly status: InputMaybe<SortOrderEnum>;
};

type componentMetaJsonPlatformDocs = {
  readonly overview: Maybe<componentMetaJsonPlatformDocsOverview>;
  readonly style: Maybe<componentMetaJsonPlatformDocsStyle>;
  readonly usage: Maybe<componentMetaJsonPlatformDocsUsage>;
};

type componentMetaJsonPlatformDocsFieldSelector = {
  readonly overview: InputMaybe<componentMetaJsonPlatformDocsOverviewFieldSelector>;
  readonly style: InputMaybe<componentMetaJsonPlatformDocsStyleFieldSelector>;
  readonly usage: InputMaybe<componentMetaJsonPlatformDocsUsageFieldSelector>;
};

type componentMetaJsonPlatformDocsFilterInput = {
  readonly overview: InputMaybe<componentMetaJsonPlatformDocsOverviewFilterInput>;
  readonly style: InputMaybe<componentMetaJsonPlatformDocsStyleFilterInput>;
  readonly usage: InputMaybe<componentMetaJsonPlatformDocsUsageFilterInput>;
};

type componentMetaJsonPlatformDocsOverview = {
  readonly mdx: Maybe<File>;
  readonly status: Maybe<Scalars['String']>;
  readonly storybook: Maybe<componentMetaJsonPlatformDocsOverviewStorybook>;
};

type componentMetaJsonPlatformDocsOverviewFieldSelector = {
  readonly mdx: InputMaybe<FileFieldSelector>;
  readonly status: InputMaybe<FieldSelectorEnum>;
  readonly storybook: InputMaybe<componentMetaJsonPlatformDocsOverviewStorybookFieldSelector>;
};

type componentMetaJsonPlatformDocsOverviewFilterInput = {
  readonly mdx: InputMaybe<FileFilterInput>;
  readonly status: InputMaybe<StringQueryOperatorInput>;
  readonly storybook: InputMaybe<componentMetaJsonPlatformDocsOverviewStorybookFilterInput>;
};

type componentMetaJsonPlatformDocsOverviewSortInput = {
  readonly mdx: InputMaybe<FileSortInput>;
  readonly status: InputMaybe<SortOrderEnum>;
  readonly storybook: InputMaybe<componentMetaJsonPlatformDocsOverviewStorybookSortInput>;
};

type componentMetaJsonPlatformDocsOverviewStorybook = {
  readonly height: Maybe<Scalars['String']>;
  readonly path: Maybe<Scalars['String']>;
};

type componentMetaJsonPlatformDocsOverviewStorybookFieldSelector = {
  readonly height: InputMaybe<FieldSelectorEnum>;
  readonly path: InputMaybe<FieldSelectorEnum>;
};

type componentMetaJsonPlatformDocsOverviewStorybookFilterInput = {
  readonly height: InputMaybe<StringQueryOperatorInput>;
  readonly path: InputMaybe<StringQueryOperatorInput>;
};

type componentMetaJsonPlatformDocsOverviewStorybookSortInput = {
  readonly height: InputMaybe<SortOrderEnum>;
  readonly path: InputMaybe<SortOrderEnum>;
};

type componentMetaJsonPlatformDocsSortInput = {
  readonly overview: InputMaybe<componentMetaJsonPlatformDocsOverviewSortInput>;
  readonly style: InputMaybe<componentMetaJsonPlatformDocsStyleSortInput>;
  readonly usage: InputMaybe<componentMetaJsonPlatformDocsUsageSortInput>;
};

type componentMetaJsonPlatformDocsStyle = {
  readonly mdx: Maybe<File>;
  readonly status: Maybe<Scalars['String']>;
};

type componentMetaJsonPlatformDocsStyleFieldSelector = {
  readonly mdx: InputMaybe<FileFieldSelector>;
  readonly status: InputMaybe<FieldSelectorEnum>;
};

type componentMetaJsonPlatformDocsStyleFilterInput = {
  readonly mdx: InputMaybe<FileFilterInput>;
  readonly status: InputMaybe<StringQueryOperatorInput>;
};

type componentMetaJsonPlatformDocsStyleSortInput = {
  readonly mdx: InputMaybe<FileSortInput>;
  readonly status: InputMaybe<SortOrderEnum>;
};

type componentMetaJsonPlatformDocsUsage = {
  readonly mdx: Maybe<File>;
  readonly status: Maybe<Scalars['String']>;
};

type componentMetaJsonPlatformDocsUsageFieldSelector = {
  readonly mdx: InputMaybe<FileFieldSelector>;
  readonly status: InputMaybe<FieldSelectorEnum>;
};

type componentMetaJsonPlatformDocsUsageFilterInput = {
  readonly mdx: InputMaybe<FileFilterInput>;
  readonly status: InputMaybe<StringQueryOperatorInput>;
};

type componentMetaJsonPlatformDocsUsageSortInput = {
  readonly mdx: InputMaybe<FileSortInput>;
  readonly status: InputMaybe<SortOrderEnum>;
};

type componentMetaJsonPlatformFieldSelector = {
  readonly android: InputMaybe<componentMetaJsonPlatformAndroidFieldSelector>;
  readonly docs: InputMaybe<componentMetaJsonPlatformDocsFieldSelector>;
  readonly figma: InputMaybe<componentMetaJsonPlatformFigmaFieldSelector>;
  readonly ios: InputMaybe<componentMetaJsonPlatformIosFieldSelector>;
  readonly react: InputMaybe<componentMetaJsonPlatformReactFieldSelector>;
};

type componentMetaJsonPlatformFigma = {
  readonly path: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
};

type componentMetaJsonPlatformFigmaFieldSelector = {
  readonly path: InputMaybe<FieldSelectorEnum>;
  readonly status: InputMaybe<FieldSelectorEnum>;
};

type componentMetaJsonPlatformFigmaFilterInput = {
  readonly path: InputMaybe<StringQueryOperatorInput>;
  readonly status: InputMaybe<StringQueryOperatorInput>;
};

type componentMetaJsonPlatformFigmaSortInput = {
  readonly path: InputMaybe<SortOrderEnum>;
  readonly status: InputMaybe<SortOrderEnum>;
};

type componentMetaJsonPlatformFilterInput = {
  readonly android: InputMaybe<componentMetaJsonPlatformAndroidFilterInput>;
  readonly docs: InputMaybe<componentMetaJsonPlatformDocsFilterInput>;
  readonly figma: InputMaybe<componentMetaJsonPlatformFigmaFilterInput>;
  readonly ios: InputMaybe<componentMetaJsonPlatformIosFilterInput>;
  readonly react: InputMaybe<componentMetaJsonPlatformReactFilterInput>;
};

type componentMetaJsonPlatformIos = {
  readonly alias: Maybe<Scalars['String']>;
  readonly path: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
};

type componentMetaJsonPlatformIosFieldSelector = {
  readonly alias: InputMaybe<FieldSelectorEnum>;
  readonly path: InputMaybe<FieldSelectorEnum>;
  readonly status: InputMaybe<FieldSelectorEnum>;
};

type componentMetaJsonPlatformIosFilterInput = {
  readonly alias: InputMaybe<StringQueryOperatorInput>;
  readonly path: InputMaybe<StringQueryOperatorInput>;
  readonly status: InputMaybe<StringQueryOperatorInput>;
};

type componentMetaJsonPlatformIosSortInput = {
  readonly alias: InputMaybe<SortOrderEnum>;
  readonly path: InputMaybe<SortOrderEnum>;
  readonly status: InputMaybe<SortOrderEnum>;
};

type componentMetaJsonPlatformReact = {
  readonly path: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
};

type componentMetaJsonPlatformReactFieldSelector = {
  readonly path: InputMaybe<FieldSelectorEnum>;
  readonly status: InputMaybe<FieldSelectorEnum>;
};

type componentMetaJsonPlatformReactFilterInput = {
  readonly path: InputMaybe<StringQueryOperatorInput>;
  readonly status: InputMaybe<StringQueryOperatorInput>;
};

type componentMetaJsonPlatformReactSortInput = {
  readonly path: InputMaybe<SortOrderEnum>;
  readonly status: InputMaybe<SortOrderEnum>;
};

type componentMetaJsonPlatformSortInput = {
  readonly android: InputMaybe<componentMetaJsonPlatformAndroidSortInput>;
  readonly docs: InputMaybe<componentMetaJsonPlatformDocsSortInput>;
  readonly figma: InputMaybe<componentMetaJsonPlatformFigmaSortInput>;
  readonly ios: InputMaybe<componentMetaJsonPlatformIosSortInput>;
  readonly react: InputMaybe<componentMetaJsonPlatformReactSortInput>;
};

type componentMetaJsonSortInput = {
  readonly _schema: InputMaybe<SortOrderEnum>;
  readonly alias: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly description: InputMaybe<SortOrderEnum>;
  readonly group: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly name: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly platform: InputMaybe<componentMetaJsonPlatformSortInput>;
  readonly primitive: InputMaybe<FileSortInput>;
  readonly thumbnail: InputMaybe<FileSortInput>;
};

type primitiveMetaJson = Node & {
  readonly _schema: Maybe<Scalars['String']>;
  readonly children: ReadonlyArray<Node>;
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly internal: Internal;
  readonly name: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly primitive: Maybe<File>;
  readonly thumbnail: Maybe<File>;
};

type primitiveMetaJsonConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<primitiveMetaJsonEdge>;
  readonly group: ReadonlyArray<primitiveMetaJsonGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<primitiveMetaJson>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type primitiveMetaJsonConnection_distinctArgs = {
  field: primitiveMetaJsonFieldSelector;
};


type primitiveMetaJsonConnection_groupArgs = {
  field: primitiveMetaJsonFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type primitiveMetaJsonConnection_maxArgs = {
  field: primitiveMetaJsonFieldSelector;
};


type primitiveMetaJsonConnection_minArgs = {
  field: primitiveMetaJsonFieldSelector;
};


type primitiveMetaJsonConnection_sumArgs = {
  field: primitiveMetaJsonFieldSelector;
};

type primitiveMetaJsonEdge = {
  readonly next: Maybe<primitiveMetaJson>;
  readonly node: primitiveMetaJson;
  readonly previous: Maybe<primitiveMetaJson>;
};

type primitiveMetaJsonFieldSelector = {
  readonly _schema: InputMaybe<FieldSelectorEnum>;
  readonly children: InputMaybe<NodeFieldSelector>;
  readonly description: InputMaybe<FieldSelectorEnum>;
  readonly id: InputMaybe<FieldSelectorEnum>;
  readonly internal: InputMaybe<InternalFieldSelector>;
  readonly name: InputMaybe<FieldSelectorEnum>;
  readonly parent: InputMaybe<NodeFieldSelector>;
  readonly primitive: InputMaybe<FileFieldSelector>;
  readonly thumbnail: InputMaybe<FileFieldSelector>;
};

type primitiveMetaJsonFilterInput = {
  readonly _schema: InputMaybe<StringQueryOperatorInput>;
  readonly children: InputMaybe<NodeFilterListInput>;
  readonly description: InputMaybe<StringQueryOperatorInput>;
  readonly id: InputMaybe<StringQueryOperatorInput>;
  readonly internal: InputMaybe<InternalFilterInput>;
  readonly name: InputMaybe<StringQueryOperatorInput>;
  readonly parent: InputMaybe<NodeFilterInput>;
  readonly primitive: InputMaybe<FileFilterInput>;
  readonly thumbnail: InputMaybe<FileFilterInput>;
};

type primitiveMetaJsonFilterListInput = {
  readonly elemMatch: InputMaybe<primitiveMetaJsonFilterInput>;
};

type primitiveMetaJsonGroupConnection = {
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly edges: ReadonlyArray<primitiveMetaJsonEdge>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
  readonly group: ReadonlyArray<primitiveMetaJsonGroupConnection>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly nodes: ReadonlyArray<primitiveMetaJson>;
  readonly pageInfo: PageInfo;
  readonly sum: Maybe<Scalars['Float']>;
  readonly totalCount: Scalars['Int'];
};


type primitiveMetaJsonGroupConnection_distinctArgs = {
  field: primitiveMetaJsonFieldSelector;
};


type primitiveMetaJsonGroupConnection_groupArgs = {
  field: primitiveMetaJsonFieldSelector;
  limit: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
};


type primitiveMetaJsonGroupConnection_maxArgs = {
  field: primitiveMetaJsonFieldSelector;
};


type primitiveMetaJsonGroupConnection_minArgs = {
  field: primitiveMetaJsonFieldSelector;
};


type primitiveMetaJsonGroupConnection_sumArgs = {
  field: primitiveMetaJsonFieldSelector;
};

type primitiveMetaJsonSortInput = {
  readonly _schema: InputMaybe<SortOrderEnum>;
  readonly children: InputMaybe<NodeSortInput>;
  readonly description: InputMaybe<SortOrderEnum>;
  readonly id: InputMaybe<SortOrderEnum>;
  readonly internal: InputMaybe<InternalSortInput>;
  readonly name: InputMaybe<SortOrderEnum>;
  readonly parent: InputMaybe<NodeSortInput>;
  readonly primitive: InputMaybe<FileSortInput>;
  readonly thumbnail: InputMaybe<FileSortInput>;
};

type ColorSystemPageQueryVariables = Exact<{ [key: string]: never; }>;


type ColorSystemPageQuery = { readonly system: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly scaleToken1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly scaleToken2: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly semanticToken1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly semanticToken2: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly staticToken1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null };

type ColorUsagePageQueryVariables = Exact<{ [key: string]: never; }>;


type ColorUsagePageQuery = { readonly lightDark1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly lightDark2: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly primary1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly primary2: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly primary3: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly gray1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly gray2: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly grayDont1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly grayDo1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly paper1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly paper2: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly interactive1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly interactiveDont1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly interactiveDo1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly combining1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly combiningDont1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly combiningDo1: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null };

type ComponentListPageQueryVariables = Exact<{ [key: string]: never; }>;


type ComponentListPageQuery = { readonly allComponentMetaJson: { readonly nodes: ReadonlyArray<{ readonly name: string | null, readonly group: string | null, readonly description: string | null, readonly thumbnail: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly platform: { readonly docs: { readonly overview: { readonly status: string | null, readonly mdx: { readonly childMdx: { readonly frontmatter: { readonly slug: string | null } | null } | null } | null } | null } | null } | null }> } };

type ComponentOverviewQueryVariables = Exact<{
  id: InputMaybe<Scalars['String']>;
}>;


type ComponentOverviewQuery = { readonly componentMetaJson: { readonly name: string | null, readonly description: string | null, readonly platform: { readonly ios: { readonly path: string | null, readonly status: string | null } | null, readonly android: { readonly path: string | null, readonly status: string | null } | null, readonly react: { readonly path: string | null, readonly status: string | null } | null, readonly docs: { readonly overview: { readonly status: string | null, readonly storybook: { readonly path: string | null, readonly height: string | null } | null, readonly mdx: { readonly childMdx: { readonly tableOfContents: any | null } | null } | null } | null } | null } | null, readonly primitive: { readonly childPrimitiveMetaJson: { readonly primitive: { readonly childMdx: { readonly frontmatter: { readonly slug: string | null } | null } | null } | null } | null } | null } | null };

type ComponentProgressBoardPageQueryVariables = Exact<{ [key: string]: never; }>;


type ComponentProgressBoardPageQuery = { readonly allComponentMetaJson: { readonly nodes: ReadonlyArray<{ readonly name: string | null, readonly description: string | null, readonly platform: { readonly android: { readonly path: string | null, readonly status: string | null } | null, readonly ios: { readonly alias: string | null, readonly path: string | null, readonly status: string | null } | null, readonly react: { readonly path: string | null, readonly status: string | null } | null, readonly figma: { readonly path: string | null, readonly status: string | null } | null } | null }> } };

type ComponentStyleQueryVariables = Exact<{
  id: InputMaybe<Scalars['String']>;
}>;


type ComponentStyleQuery = { readonly componentMetaJson: { readonly name: string | null, readonly description: string | null, readonly platform: { readonly docs: { readonly style: { readonly mdx: { readonly childMdx: { readonly tableOfContents: any | null } | null } | null } | null } | null } | null, readonly primitive: { readonly childPrimitiveMetaJson: { readonly primitive: { readonly childMdx: { readonly frontmatter: { readonly slug: string | null } | null } | null } | null } | null } | null } | null };

type ComponentUsageQueryVariables = Exact<{
  id: InputMaybe<Scalars['String']>;
}>;


type ComponentUsageQuery = { readonly componentMetaJson: { readonly name: string | null, readonly description: string | null, readonly platform: { readonly docs: { readonly usage: { readonly mdx: { readonly childMdx: { readonly tableOfContents: any | null } | null } | null } | null } | null } | null, readonly primitive: { readonly childPrimitiveMetaJson: { readonly primitive: { readonly childMdx: { readonly frontmatter: { readonly slug: string | null } | null } | null } | null } | null } | null } | null };

type PrimitiveDocTemplateQueryVariables = Exact<{
  id: InputMaybe<Scalars['String']>;
}>;


type PrimitiveDocTemplateQuery = { readonly primitiveMetaJson: { readonly name: string | null, readonly description: string | null, readonly primitive: { readonly childMdx: { readonly tableOfContents: any | null, readonly frontmatter: { readonly slug: string | null } | null } | null } | null } | null };

type PrimitiveListPageQueryVariables = Exact<{ [key: string]: never; }>;


type PrimitiveListPageQuery = { readonly allPrimitiveMetaJson: { readonly nodes: ReadonlyArray<{ readonly name: string | null, readonly description: string | null, readonly thumbnail: { readonly childImageSharp: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null } | null, readonly primitive: { readonly childMdx: { readonly frontmatter: { readonly slug: string | null } | null } | null } | null }> } };

type SEOQueryVariables = Exact<{ [key: string]: never; }>;


type SEOQuery = { readonly ogImage: { readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData } | null, readonly blackFavicon: { readonly publicURL: string | null } | null, readonly whiteFavicon: { readonly publicURL: string | null } | null };

type SidebarQueryVariables = Exact<{ [key: string]: never; }>;


type SidebarQuery = { readonly allComponentMetaJson: { readonly nodes: ReadonlyArray<{ readonly name: string | null, readonly group: string | null, readonly alias: string | null, readonly platform: { readonly docs: { readonly overview: { readonly status: string | null, readonly mdx: { readonly childMdx: { readonly frontmatter: { readonly slug: string | null } | null } | null } | null } | null } | null } | null }> } };


}
