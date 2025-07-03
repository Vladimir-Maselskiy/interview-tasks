import React, { useState, useEffect } from 'react';

type CurrencyCode = 'USD' | 'EUR' | 'UAH';

interface Currency {
  code: CurrencyCode;
  name: string;
}

interface CurrencyRate {
  r030?: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate?: string;
}

const uahCurrencyRate: CurrencyRate = {
  txt: 'Гривня',
  rate: 1,
  cc: 'UAH',
};

export const API_BASE_URL = 'http://localhost:8000';

const defaultCurrencies: Currency[] = [
  { code: 'USD', name: 'Долар США' },
  { code: 'EUR', name: 'Євро' },
  { code: 'UAH', name: 'Гривня' },
];

const CurrencyConverter: React.FC = () => {
  const [from, setFrom] = useState<CurrencyCode>('USD');
  const [to, setTo] = useState<CurrencyCode>('UAH');
  const [amount, setAmount] = useState<number>(1);
  const [value, setValue] = useState<number | null>(null);
  const [currency, setCurrency] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch('http://localhost:8000/currency');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCurrency([...data, uahCurrencyRate]);
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onChangeButtonClick = () => {
    const currencyFrom = currency.find((item: any) => item.cc === from);
    const currencyTo = currency.find((item: any) => item.cc === to);
    console.log('currencyFrom', currencyFrom, 'currencyTo', currencyTo);
    if (currencyFrom && currencyTo) {
      const value = (currencyFrom.rate / currencyTo.rate) * amount;
      if (value && typeof value === 'number') {
        setValue(value);
        setIsError(false);
      } else {
        setValue(null);
        setIsError(true);
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '2rem auto',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 2px 8px #ddd',
      }}
    >
      <h2>Конвертер валют (НБУ)</h2>
      <div>
        <input
          type="number"
          value={amount}
          min={0}
          step="any"
          onChange={e => {
            setAmount(Number(e.target.value));
            setValue(null);
          }}
          style={{ width: '100%', marginBottom: 12, fontSize: 18, padding: 8 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select
          value={from}
          onChange={e => {
            setFrom(e.target.value as CurrencyCode);
            setValue(null);
          }}
          style={{ flex: 1 }}
        >
          {defaultCurrencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <span style={{ alignSelf: 'center' }}>→</span>
        <select
          value={to}
          onChange={e => {
            setTo(e.target.value as CurrencyCode);
            setValue(null);
          }}
          style={{ flex: 1 }}
        >
          {defaultCurrencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onChangeButtonClick}
        disabled={isLoading}
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: 8,
          borderRadius: 8,
          width: '100%',
        }}
      >
        Ковертувати
      </button>
      {value && (
        <div style={{ marginTop: 12 }}>
          <span>
            {amount} {from} = {value.toFixed(2)} {to}
          </span>
        </div>
      )}
      {isError && <span style={{ color: 'red' }}>Виникла помилка</span>}
    </div>
  );
};

export default CurrencyConverter;
