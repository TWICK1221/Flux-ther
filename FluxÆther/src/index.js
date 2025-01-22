import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ����� �������
import App from './App'; // �������� ��������� ����������
import reportWebVitals from './reportWebVitals'; // ��� ������ ������������������
import { CurrencyProvider } from './CurrencyContext'; // ��������� ��� ���������� �������� ����������

// ��������� ��������� �������� �� index.html
const rootElement = document.getElementById('root');

// �������� ������������� ��������� ��������
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    // ������ ���������� � �������������� ���������
    root.render(
        <React.StrictMode>
            <CurrencyProvider>
                <App />
            </CurrencyProvider>
        </React.StrictMode>
    );
} else {
    console.error('������� � ID root �� ������. ��������� index.html � ����� public.');
}

// ��������� ������ ������������������ ����������
reportWebVitals(console.log);
