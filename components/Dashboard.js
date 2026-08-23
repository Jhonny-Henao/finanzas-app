"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Trash2,
  CalendarDays,
  CircleDollarSign,
  Receipt,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getData, saveData } from "../lib/storage";

import {
  formatMoney,
  parseMoney,
} from "../lib/format";

import AccountCard from "./AccountCard";
import TransactionModal from "./TransactionModal";

export default function Dashboard() {
  const [data, setData] = useState({
    accounts: [],
    savings: [],
  });

  const [loaded, setLoaded] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState(null);

  const [showCreate, setShowCreate] =
    useState(false);

  const [showTransaction, setShowTransaction] =
    useState(false);

  const [accountName, setAccountName] =
    useState("");

  const [income, setIncome] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const accountsPerPage = 6;

  useEffect(() => {
    const saved = getData();

    setData(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveData(data);
    }
  }, [data, loaded]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalSavings = useMemo(() => {
    return data.savings.reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );
  }, [data.savings]);

  const filteredAccounts = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return data.accounts;
    }

    return data.accounts.filter((account) =>
      account.name
        .toLowerCase()
        .includes(searchValue)
    );
  }, [data.accounts, search]);

  const totalPages = Math.ceil(
    filteredAccounts.length /
      accountsPerPage
  );

  const paginatedAccounts =
    filteredAccounts.slice(
      (currentPage - 1) *
        accountsPerPage,
      currentPage *
        accountsPerPage
    );

  function createAccount(e) {
    e.preventDefault();

    const numericIncome =
      parseMoney(income);

    if (
      !accountName.trim() ||
      !numericIncome
    ) {
      return;
    }

    const newAccount = {
      id: crypto.randomUUID(),
      name: accountName.trim(),
      income: numericIncome,
      date: new Date().toLocaleDateString(
        "es-CO"
      ),
      transactions: [],
      createdAt:
        new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,

      accounts: [
        newAccount,
        ...prev.accounts,
      ],
    }));

    setAccountName("");
    setIncome("");
    setShowCreate(false);
  }

  function deleteAccount(id) {
    const confirmDelete =
      window.confirm(
        "¿Seguro que quieres eliminar esta cuenta? Esta acción no se puede deshacer."
      );

    if (!confirmDelete) {
      return;
    }

    setData((prev) => ({
      ...prev,

      accounts:
        prev.accounts.filter(
          (account) =>
            account.id !== id
        ),
    }));

    setSelectedAccount(null);
  }

  function addTransaction(transaction) {
    if (!selectedAccount) {
      return;
    }

    setData((prev) => {
      const updatedAccounts =
        prev.accounts.map(
          (account) => {
            if (
              account.id !==
              selectedAccount.id
            ) {
              return account;
            }

            return {
              ...account,

              transactions: [
                transaction,
                ...account.transactions,
              ],
            };
          }
        );

      return {
        ...prev,

        accounts: updatedAccounts,

        savings:
          transaction.type === "saving"
            ? [
                ...prev.savings,

                {
                  ...transaction,
                  accountId:
                    selectedAccount.id,
                  accountName:
                    selectedAccount.name,
                },
              ]
            : prev.savings,
      };
    });

    setSelectedAccount((prev) => ({
      ...prev,

      transactions: [
        transaction,
        ...prev.transactions,
      ],
    }));
  }

  function deleteTransaction(
    transactionId
  ) {
    if (!selectedAccount) {
      return;
    }

    const transaction =
      selectedAccount.transactions.find(
        (item) =>
          item.id === transactionId
      );

    if (!transaction) {
      return;
    }

    setData((prev) => ({
      ...prev,

      accounts:
        prev.accounts.map(
          (account) =>
            account.id ===
            selectedAccount.id
              ? {
                  ...account,

                  transactions:
                    account.transactions.filter(
                      (item) =>
                        item.id !==
                        transactionId
                    ),
                }
              : account
        ),

      savings:
        transaction.type === "saving"
          ? prev.savings.filter(
              (item) =>
                item.id !==
                transactionId
            )
          : prev.savings,
    }));

    setSelectedAccount((prev) => ({
      ...prev,

      transactions:
        prev.transactions.filter(
          (item) =>
            item.id !==
            transactionId
        ),
    }));
  }

  function calculateAccount(
    account
  ) {
    const expenses =
      account.transactions
        .filter(
          (item) =>
            item.type ===
            "expense"
        )
        .reduce(
          (total, item) =>
            total +
            Number(item.amount),
          0
        );

    const savings =
      account.transactions
        .filter(
          (item) =>
            item.type ===
            "saving"
        )
        .reduce(
          (total, item) =>
            total +
            Number(item.amount),
          0
        );

    return {
      expenses,
      savings,

      balance:
        Number(account.income) -
        expenses -
        savings,
    };
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-400">
            Cargando tus finanzas...
          </p>

        </div>
      </div>
    );
  }

  if (selectedAccount) {
    const totals =
      calculateAccount(
        selectedAccount
      );

    return (
      <>
        <main className="min-h-screen pb-10">

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">

            <button
              onClick={() =>
                setSelectedAccount(
                  null
                )
              }
              className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-white"
            >
              <ArrowLeft size={18} />
              Volver
            </button>

            <div className="mb-6">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                <div>

                  <p className="mb-1 text-sm font-medium text-slate-400">
                    Cuenta
                  </p>

                  <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                    {selectedAccount.name}
                  </h1>

                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                    <CalendarDays size={15} />
                    {selectedAccount.date}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setShowTransaction(
                      true
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  <Plus size={19} />
                  Agregar gasto
                </button>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Ingreso"
                value={
                  selectedAccount.income
                }
                icon={
                  <TrendingUp size={20} />
                }
                type="income"
              />

              <StatCard
                title="Gastos"
                value={
                  totals.expenses
                }
                icon={
                  <TrendingDown size={20} />
                }
                type="expense"
              />

              <StatCard
                title="Ahorro"
                value={
                  totals.savings
                }
                icon={
                  <PiggyBank size={20} />
                }
                type="saving"
              />

              <StatCard
                title="Disponible"
                value={
                  totals.balance
                }
                icon={
                  <Wallet size={20} />
                }
                type="balance"
              />

            </div>

            <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-black text-slate-900">
                    Movimientos
                  </h2>

                  <p className="text-sm text-slate-400">
                    Gastos y ahorros de
                    esta cuenta
                  </p>

                </div>

                <Receipt className="text-slate-300" />

              </div>

              {selectedAccount
                .transactions
                .length === 0 ? (

                <div className="rounded-2xl bg-slate-50 py-12 text-center">

                  <CircleDollarSign
                    size={40}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <p className="font-bold text-slate-600">
                    Todavía no tienes
                    movimientos
                  </p>

                  <p className="text-sm text-slate-400">
                    Empieza agregando
                    tu primer gasto
                  </p>

                </div>

              ) : (

                <div className="space-y-2">

                  {selectedAccount.transactions.map(
                    (transaction) => (
                      <TransactionRow
                        key={
                          transaction.id
                        }
                        transaction={
                          transaction
                        }
                        onDelete={
                          deleteTransaction
                        }
                      />
                    )
                  )}

                </div>

              )}

            </div>

            <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">

              <p className="text-sm text-slate-400">
                Resumen de la cuenta
              </p>

              <div className="mt-2 flex items-end justify-between">

                <div>

                  <p
                    className={`text-4xl font-black ${
                      totals.balance <
                      0
                        ? "text-red-400"
                        : "text-white"
                    }`}
                  >
                    $
                    {totals.balance.toLocaleString(
                      "es-CO"
                    )}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    dinero disponible
                  </p>

                </div>

                <Wallet
                  size={38}
                  className="text-slate-500"
                />

              </div>

            </div>

          </div>

        </main>

        {showTransaction && (
          <TransactionModal
            account={
              selectedAccount
            }
            onClose={() =>
              setShowTransaction(
                false
              )
            }
            onAdd={
              addTransaction
            }
          />
        )}
      </>
    );
  }

  return (
    <main className="min-h-screen pb-10">

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">

        <header className="mb-8 flex items-center justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Wallet size={18} />
              </div>

              <span className="text-sm font-bold text-slate-500">
                Mis Finanzas
              </span>

            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Controla tu plata.
            </h1>

            <p className="mt-1 text-slate-400">
              Organiza tus ingresos,
              gastos y ahorros.
            </p>

          </div>

          <button
            onClick={() =>
              setShowCreate(true)
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition hover:scale-105 sm:h-auto sm:w-auto sm:px-5 sm:py-3"
          >

            <Plus size={20} />

            <span className="ml-2 hidden font-bold sm:inline">
              Nueva cuenta
            </span>

          </button>

        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">

          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl">

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Ahorros acumulados
                </span>

                <PiggyBank
                  size={22}
                  className="text-violet-400"
                />

              </div>

              <p className="text-4xl font-black">
                $
                {totalSavings.toLocaleString(
                  "es-CO"
                )}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Total guardado en todas
                tus cuentas
              </p>

            </div>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

            <div className="mb-5 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-400">
                Cuentas
              </span>

              <Wallet
                size={22}
                className="text-slate-400"
              />

            </div>

            <p className="text-4xl font-black text-slate-900">
              {data.accounts.length}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Quincenas o presupuestos
              creados
            </p>

          </div>

        </section>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-black text-slate-900">
              Mis cuentas
            </h2>

            <p className="text-sm text-slate-400">
              Cada cuenta puede
              representar una quincena.
            </p>

          </div>

          {data.accounts.length >
            0 && (

            <div className="relative w-full sm:w-80">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Buscar cuenta..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}

            </div>

          )}

        </div>

        {data.accounts.length ===
        0 ? (

          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">

              <Wallet
                size={28}
                className="text-slate-400"
              />

            </div>

            <h2 className="text-xl font-black text-slate-800">
              Todavía no tienes
              cuentas
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Crea tu primera
              quincena, agrega tu
              salario y empieza a
              registrar tus gastos.
            </p>

            <button
              onClick={() =>
                setShowCreate(true)
              }
              className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white"
            >
              Crear mi primera
              cuenta
            </button>

          </div>

        ) : filteredAccounts.length ===
          0 ? (

          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">

            <Search
              size={40}
              className="mx-auto mb-4 text-slate-300"
            />

            <h2 className="text-xl font-black text-slate-800">
              No encontramos cuentas
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Prueba con otro nombre.
            </p>

            <button
              onClick={() =>
                setSearch("")
              }
              className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              Limpiar búsqueda
            </button>

          </div>

        ) : (

          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {paginatedAccounts.map(
                (account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onSelect={
                      setSelectedAccount
                    }
                    onDelete={
                      deleteAccount
                    }
                  />
                )
              )}

            </div>

            {totalPages > 1 && (

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  disabled={
                    currentPage ===
                    1
                  }
                  className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={16}
                  />

                  Anterior
                </button>

                <div className="flex items-center gap-1">

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (

                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition ${
                        currentPage ===
                        page
                          ? "bg-slate-900 text-white shadow-lg"
                          : "bg-white text-slate-500 ring-1 ring-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>

                  ))}

                </div>

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente

                  <ChevronRight
                    size={16}
                  />
                </button>

              </div>

            )}

            <p className="mt-3 text-center text-xs text-slate-400">
              Mostrando{" "}
              {paginatedAccounts.length}{" "}
              de{" "}
              {filteredAccounts.length}{" "}
              cuentas
            </p>

          </>

        )}

      </div>

      {showCreate && (

        <CreateAccountModal
          accountName={
            accountName
          }
          setAccountName={
            setAccountName
          }
          income={income}
          setIncome={setIncome}
          onClose={() =>
            setShowCreate(false)
          }
          onSubmit={
            createAccount
          }
        />

      )}

    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  type,
}) {
  const styles = {
    income:
      "bg-emerald-50 text-emerald-600",

    expense:
      "bg-red-50 text-red-500",

    saving:
      "bg-violet-50 text-violet-600",

    balance:
      "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${styles[type]}`}
      >
        {icon}
      </div>

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p
        className={`mt-1 text-2xl font-black ${
          type === "balance" &&
          value < 0
            ? "text-red-500"
            : "text-slate-900"
        }`}
      >
        $
        {Number(value).toLocaleString(
          "es-CO"
        )}
      </p>

    </div>
  );
}

function TransactionRow({
  transaction,
  onDelete,
}) {
  const isSaving =
    transaction.type === "saving";

  const icons = {
    Gasolina: "⛽",
    Luz: "💡",
    Agua: "💧",
    Internet: "🌐",
    Mercado: "🛒",
    Cuota: "💳",
    Arriendo: "🏠",
    Ahorro: "💰",
    Otros: "📦",
  };

  return (
    <div className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50">

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
          isSaving
            ? "bg-violet-50"
            : "bg-slate-100"
        }`}
      >
        {icons[
          transaction.category
        ] || "💸"}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate font-bold text-slate-800">
          {transaction.category}
        </p>

        <p className="truncate text-xs text-slate-400">
          {transaction.description ||
            transaction.date}
        </p>

      </div>

      <div className="text-right">

        <p
          className={`font-black ${
            isSaving
              ? "text-violet-600"
              : "text-red-500"
          }`}
        >
          -$
          {Number(
            transaction.amount
          ).toLocaleString(
            "es-CO"
          )}
        </p>

        <p className="text-[11px] text-slate-400">
          {transaction.date}
        </p>

      </div>

      <button
        onClick={() =>
          onDelete(
            transaction.id
          )
        }
        className="hidden rounded-xl p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-500 group-hover:block"
      >
        <Trash2 size={16} />
      </button>

    </div>
  );
}

function CreateAccountModal({
  accountName,
  setAccountName,
  income,
  setIncome,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">

      <div className="animate-fade w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-black text-slate-900">
              Nueva cuenta
            </h2>

            <p className="text-sm text-slate-400">
              Crea una nueva
              quincena o presupuesto.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2 transition hover:bg-slate-200"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Nombre
            </label>

            <input
              value={accountName}
              onChange={(e) =>
                setAccountName(
                  e.target.value
                )
              }
              placeholder="Ej: Quincena 1 - Agosto"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
              required
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Salario / ingreso total
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                $
              </span>

              <input
                type="text"
                inputMode="numeric"
                value={income}
                onChange={(e) =>
                  setIncome(
                    formatMoney(
                      e.target.value
                    )
                  )
                }
                placeholder="0"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-lg font-bold outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                required
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Ejemplo: 2.500.000
            </p>

          </div>

          <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            💰 Este será el dinero
            disponible inicial para
            esta cuenta.
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-lg transition hover:bg-slate-800"
          >
            Crear cuenta
          </button>

        </form>

      </div>

    </div>
  );
}