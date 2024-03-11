import {useEffect, useState} from "react";
import axios from "axios";

export default function Home(){
    const [countries, setCountries] = useState([]);
    const [name, setName] = useState('');
    const [foundCountries, setFoundCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [paginationSize] = useState(3); // Số lượng trang được hiển thị

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all?fields=name,flags').then(res => {
            setCountries(res.data);
            setFoundCountries(res.data);
        });
    }, []);

    const filter = (e) => {
        const keyword = e.target.value;

        if (keyword !== '') {
            const results = countries.filter(country => {
                return country.name.common.toLowerCase().startsWith(keyword.toLowerCase());
            });
            setFoundCountries(results);
        } else {
            setFoundCountries(countries);
        }

        setName(keyword);
        setCurrentPage(1); // Reset to the first page when filtering
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = foundCountries.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Tính toán số lượng trang được hiển thị
    const totalPaginationPages = Math.ceil(foundCountries.length / itemsPerPage);
    const paginationStart = Math.max(1, currentPage - Math.floor(paginationSize / 2));
    const paginationEnd = Math.min(totalPaginationPages, paginationStart + paginationSize - 1);

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <input
                        type="search"
                        value={name}
                        onChange={filter}
                        className="input"
                        placeholder="Filter"
                    />
                    <table className="table table-bordered table-dark">
                        <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{indexOfFirstItem + index + 1}</th>
                                <td>{item.name.common}</td>
                                <td><img src={item.flags.svg} alt={item.name.common} style={{width:"100px"}}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="pagination">
                        {paginationStart !== 1 && (
                            <button className="page-link" onClick={() => paginate(1)}>1</button>
                        )}
                        {paginationStart !== 1 && (
                            <span className="page-link">...</span>
                        )}
                        {Array.from({ length: paginationEnd - paginationStart + 1 }).map((_, index) => (
                            <button key={index} className={`page-link ${currentPage === paginationStart + index ? 'active' : ''}`} onClick={() => paginate(paginationStart + index)}>{paginationStart + index}</button>
                        ))}
                        {paginationEnd !== totalPaginationPages && (
                            <span className="page-link">...</span>
                        )}
                        {paginationEnd !== totalPaginationPages && (
                            <button className="page-link" onClick={() => paginate(totalPaginationPages)}>{totalPaginationPages}</button>
                        )}
                    </div>
                    {/* Next button */}
                    {currentPage < totalPaginationPages && (
                        <button className="btn btn-primary" onClick={() => paginate(currentPage - 1)}>Back</button>
                    )}
                    {currentPage < totalPaginationPages && (
                        <button className="btn btn-primary" onClick={() => paginate(currentPage + 1)}>Next</button>
                    )}
                </div>
            </div>
        </>
    );
}