import React from 'react';
import { Pagination } from '../pages/Home/styles'; // Ajusta la ruta a tus estilos

const Paginator = ({ page, setPage, totalPages = 300 }) => {
  return (
    <Pagination>
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</button>

      {page > 3 && (
        <>
          <button onClick={() => setPage(1)} className={page === 1 ? 'active' : ''}>1</button>
          <span style={{ color: 'white' }}>...</span>
        </>
      )}

      {Array.from({ length: 5 }, (_, i) => {
        const startPage = Math.min(Math.max(1, page - 2), totalPages - 4);
        const num = startPage + i;
        return (
          <button
            key={num}
            className={page === num ? 'active' : ''}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        );
      })}

      {page < (totalPages - 2) && (
        <>
          <span style={{ color: 'white' }}>...</span>
          <button onClick={() => setPage(totalPages)} className={page === totalPages ? 'active' : ''}>
            {totalPages}
          </button>
        </>
      )}

      <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>&gt;</button>
    </Pagination>
  );
};

export default Paginator;
