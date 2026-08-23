"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { formatMoney, parseMoney } from "../lib/format";

const categories = [
  "Gasolina",
  "Luz",
  "Agua",
  "Internet",
  "Mercado",
  "Cuota",
  "Arriendo",
  "Ahorro",
  "Otros",
];

export default function TransactionModal({
  account,
  onClose,
  onAdd,
}) {
  const [category, setCategory] = useState("Gasolina");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  function handleAmountChange(e) {
    setAmount(formatMoney(e.target.value));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const numericAmount = parseMoney(amount);

    if (!numericAmount || numericAmount <= 0) {
      return;
    }

    const type =
      category === "Ahorro"
        ? "saving"
        : "expense";

    onAdd({
      id: crypto.randomUUID(),
      type,
      category,
      amount: numericAmount,
      description,
      date: new Date().toLocaleDateString("es-CO"),
      createdAt: new Date().toISOString(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="animate-fade w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Nuevo movimiento
            </h2>

            <p className="text-sm text-slate-400">
              {account.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Categoría
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              {categories.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Valor
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                $
              </span>

              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-lg font-bold outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                required
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              El valor se mostrará automáticamente con
              puntos.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Descripción
            </label>

            <input
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Ej: Tanqueo moto"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {category === "Ahorro" && (
            <div className="rounded-2xl bg-violet-50 p-4 text-sm font-medium text-violet-700">
              💰 Este valor se sumará automáticamente a
              tu acumulado de ahorros.
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Plus size={19} />
            Agregar movimiento
          </button>

        </form>
      </div>
    </div>
  );
}