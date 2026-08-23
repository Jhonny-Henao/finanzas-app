"use client";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChevronRight,
} from "lucide-react";

export default function AccountCard({
  account,
  onSelect,
  onDelete,
}) {
  const totalExpenses =
    account.transactions
      .filter(
        (item) =>
          item.type === "expense"
      )
      .reduce(
        (total, item) =>
          total +
          Number(item.amount),
        0
      );

  const totalSavings =
    account.transactions
      .filter(
        (item) =>
          item.type === "saving"
      )
      .reduce(
        (total, item) =>
          total +
          Number(item.amount),
        0
      );

  const balance =
    Number(account.income) -
    totalExpenses -
    totalSavings;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-100 transition group-hover:scale-150" />

      <div className="relative">

        <div className="mb-5 flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Wallet size={22} />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                {account.name}
              </h3>

              <p className="text-sm text-slate-400">
                {account.date}
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              onDelete(account.id)
            }
            className="rounded-xl px-2 py-1 text-xl text-slate-300 transition hover:bg-red-50 hover:text-red-500"
          >
            ×
          </button>

        </div>

        <div className="mb-5">

          <p className="text-sm text-slate-400">
            Disponible
          </p>

          <p
            className={`text-3xl font-black ${
              balance < 0
                ? "text-red-500"
                : "text-slate-900"
            }`}
          >
            $
            {balance.toLocaleString(
              "es-CO"
            )}
          </p>

        </div>

        <div className="grid grid-cols-3 gap-2">

          <div className="rounded-2xl bg-emerald-50 p-3">

            <TrendingUp
              size={17}
              className="mb-1 text-emerald-600"
            />

            <p className="text-[11px] text-slate-400">
              Ingreso
            </p>

            <p className="text-sm font-bold text-emerald-700">
              $
              {Number(
                account.income
              ).toLocaleString(
                "es-CO"
              )}
            </p>

          </div>

          <div className="rounded-2xl bg-red-50 p-3">

            <TrendingDown
              size={17}
              className="mb-1 text-red-500"
            />

            <p className="text-[11px] text-slate-400">
              Gastos
            </p>

            <p className="text-sm font-bold text-red-600">
              $
              {totalExpenses.toLocaleString(
                "es-CO"
              )}
            </p>

          </div>

          <div className="rounded-2xl bg-violet-50 p-3">

            <PiggyBank
              size={17}
              className="mb-1 text-violet-600"
            />

            <p className="text-[11px] text-slate-400">
              Ahorro
            </p>

            <p className="text-sm font-bold text-violet-600">
              $
              {totalSavings.toLocaleString(
                "es-CO"
              )}
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            onSelect(account)
          }
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-900 hover:text-white"
        >
          Ver cuenta

          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
}