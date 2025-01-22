import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './SchedulePage.css';

function SchedulePage() {
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            const response = await api.get("/shifts");
            setShifts(response.data || []);
        } catch (error) {
            console.error("Ошибка при загрузке смен:", error);
        }
    };

    return (
        <div className="schedule-page">
            <h1>График смен</h1>
            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Дата</th>
                        <th>Сотрудник</th>
                        <th>Начало</th>
                        <th>Конец</th>
                        <th>Продолжительность</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.length > 0 ? (
                        shifts.map((shift, index) => (
                            <tr key={shift.id}>
                                <td>{index + 1}</td>
                                <td>{new Date(shift.date).toLocaleDateString("ru-RU")}</td>
                                <td>{shift.employeeName}</td>
                                <td>{shift.startTime}</td>
                                <td>{shift.endTime}</td>
                                <td>{shift.duration}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-data">Нет смен для отображения</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SchedulePage;
