import type { PortableTextTypeComponentProps } from "@portabletext/react";

interface TableContainerProps {
  table: {
    rows: {
      cells: string[];
    }[];
  };
}

export const Table = (props: PortableTextTypeComponentProps<TableContainerProps>) => {
  const value = props.value.table;
  const tableHeader = value.rows[0].cells;
  const tableData = value.rows.slice(1);
  return (
    <table>
      <thead>
        <tr>
          {tableHeader.map((cell) => (
            <th key={cell}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr key={row.cells[0]}>
            {row.cells.map((cell) => (
              <td key={cell}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
