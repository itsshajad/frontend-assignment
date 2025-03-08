import { useEffect, useState } from 'react';
import { product } from './type';
import './table-style.css';

const PER_PAGE = 5;
const PAGINATION_RANGE = PER_PAGE;

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

  if (loading) return <div role="status">Loading...</div>;

  if (error) return <div role="alert">Error: {error}</div>;

  const start = currentPage * PER_PAGE;
  const end = start + PER_PAGE;

  const startPage = Math.max(
    0,
    Math.min(currentPage - 2, page - PAGINATION_RANGE)
  );
  const endPage = Math.min(page - 1, startPage + PAGINATION_RANGE - 1);

  return (
    <div>
      <table>
        <caption>Project Funding Data</caption>
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Percentage Funded</th>
            <th scope="col">Amount Pledged</th>
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
          aria-label="Go to previous page"
        >
          Prev
        </button>

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => {
          return (
            <button
              className={currentPage === page ? 'active' : ''}
              onClick={() => handleClick(page)}
              key={page}
              aria-label={`Go to page ${page + 1}`}
            >
              {page + 1}
            </button>
          );
        })}

        <button
          disabled={currentPage === page - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          aria-label="Go to next page"
        >
          Next
        </button>
      </div>
      <div className="page-info">
        Page {currentPage + 1} of {page}
      </div>
    </div>
  );
};

export default Table;
