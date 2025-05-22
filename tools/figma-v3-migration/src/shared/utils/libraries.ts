export async function getLibraryVariableCollection({
  libraryName,
  name,
}: {
  libraryName: LibraryVariableCollection["libraryName"];
  name: LibraryVariableCollection["name"];
}) {
  const libraries = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  return libraries.find((library) => library.libraryName === libraryName && library.name === name);
}
