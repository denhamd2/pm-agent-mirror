import React from 'react';
import type { CSSProperties } from 'react';

export function Table({ children, style, ...rest }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table {...rest} style={{ width: '100%', borderCollapse: 'collapse', ...style }}>
      {children}
    </table>
  );
}

Table.Head = function TableHead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
};
Table.Body = function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
};
Table.Row = function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />;
};
Table.Header = function TableHeader({
  style,
  scope = 'col',
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope={scope} {...rest} style={{ textAlign: 'left', fontWeight: 700, ...style }} />;
};
Table.Cell = function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} />;
};
