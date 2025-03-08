import { useEffect, useState } from 'react';
import { product } from './type';
import './table-style.css';

const PER_PAGE = 5;
const Table = () => {
  const [data, setData] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json'
        );
        if (!response.ok) {
          throw new Error(`Error Status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPage(data?.length ? Math.ceil(data.length / PER_PAGE) : 1);
  }, [data]);

  const handleClick = (index: number) => {
    setCurrentPage(index);
  };

  const start = currentPage * PER_PAGE;
  const end = start + PER_PAGE;

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  console.log('data', data.length);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Percentage Funded</th>
            <th>Amount Pledged</th>
          </tr>
        </thead>

        <tbody>
          {data.slice(start, end).map((item, key) => {
            return (
              <tr key={key}>
                <td> {item['s.no']}</td>
                <td>{item['percentage.funded']}</td>
                <td> {item['amt.pledged']}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {Array.from({ length: page }).map((_, key) => {
          return (
            <button
              className={currentPage === key ? 'active' : ''}
              onClick={() => handleClick(key)}
              key={key}
            >
              {key + 1}
            </button>
          );
        })}

        <button
          disabled={currentPage === page - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
