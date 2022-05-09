import "./Table.css";

export const TableRow = ({ children }) => <tr className="table-row">{children}</tr>;

export const TableCell = ({ children }) => <td className="TableCell">{children}</td>;

export const TableHeaderCell = ({ children }) => (
  <th className="TableHeaderCell">{children}</th>
);

export const TableHeader = ({ children }) => <thead className="TableHeader">{children}</thead>;

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

const Table = ({ children }) => <table className="table">{children}</table>;

export default Table;
