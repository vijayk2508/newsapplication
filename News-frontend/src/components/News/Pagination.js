
import React from 'react';
function Pagination({ newsPerPage, totalNews, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalNews / newsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <nav className="nav-pagination">
                <ul className="pagination">
                    {
                        pageNumbers.map(num => (
                            <li key={num}>
                                <a onClick={() => paginate(num)} class="page-link" href="#">{num}</a>
                            </li>
                        ))
                    }

                </ul>
            </nav>
        </div>
    )
}

export default Pagination;