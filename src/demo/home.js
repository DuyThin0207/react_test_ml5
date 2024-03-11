import {useEffect, useState} from "react";
import axios from "axios";

export default function Home(){
    const [countries, setCountries] = useState([]);
    const [name, setName] = useState('');
    const [foundCountries, setFoundCountries] = useState([]);

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all?fields=name,flags').then(res => {
            setCountries(res.data)
            setFoundCountries(res.data);
        })
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
    };
    return(
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
                        {foundCountries.map((item, index) =>(
                            <tr>
                                <th scope="row"></th>
                                <td>{index + 1} - {item.name.common}</td>
                                <td><img src={item.flags.svg} style={{width:"100px"}}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}