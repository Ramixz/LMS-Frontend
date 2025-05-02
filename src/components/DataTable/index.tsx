import { Flex } from "@mantine/core";
import {
  MantineReactTable,
  MRT_Cell,
  MRT_CellValue,
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_FilterOption,
  MRT_PaginationState,
  MRT_Row,
  MRT_RowData,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_TableOptions,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
// import useDeepCompareEffect, {
//   useDeepCompareEffectNoCheck,
// } from "use-deep-compare-effect";

export interface DataTableProps<TData extends MRT_RowData> {
  data: TData[];
  columns: MRT_ColumnDef<TData>[];
  onRowClick?: (
    row: MRT_Row<TData>,
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
  ) => void;
  renderToolbarInternalActions?: (props: {
    table: MRT_TableInstance<TData>;
  }) => React.ReactNode;
  renderRowActions?: (props: {
    cell: MRT_Cell<TData, MRT_CellValue>;
    renderedRowIndex?: number;
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
  }) => ReactNode;
  totalRowCount: number;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onStateChange?: (state: {
    columnFilters: Array<{
      id: string;
      value: unknown;
      filterFn: MRT_FilterOption;
    }>;
    globalFilter: string;
    sorting: MRT_SortingState;
    pagination: MRT_PaginationState;
  }) => void; // Debounced callback
}

type MergedFilter = {
  filterVariant: string;
  filterFn: MRT_FilterOption;
  id: string;
  value: unknown;
};

function getValueFromParam(filterObj: MergedFilter) {
  const { value, filterVariant } = filterObj;
  switch (filterVariant) {
    case "date-range":
      if (Array.isArray(value))
        return value.map((dateString) =>
          dateString ? new Date(dateString) : null
        );
      break;

    case "date":
      return value ? new Date(value as string) : null;

    default:
      return value;
      break;
  }
}

export default function DataTable<T extends MRT_RowData>({
  columns,
  data,
  onRowClick,
  renderToolbarInternalActions,
  renderRowActions,
  totalRowCount,
  isLoading,
  isError,
  isFetching,
  onStateChange,
  ...rest
}: MRT_TableOptions<T> & DataTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize states from query parameters
  const initialColumnFilters = searchParams.get("columnFilters")
    ? (
        (JSON.parse(searchParams.get("columnFilters")!) ?? []) as {
          filterVariant: string;
          filterFn: MRT_FilterOption;
          id: string;
          value: unknown;
        }[]
      ).map((filterObj) => ({
        id: filterObj.id,
        value: getValueFromParam(filterObj),
      }))
    : [];
  const initialColumnFilterFns = searchParams.get("columnFilters")
    ? (
        (JSON.parse(searchParams.get("columnFilters")!) ?? []) as {
          filterVariant: string;
          filterFn: MRT_FilterOption;
          id: string;
          value: unknown;
        }[]
      )?.reduce((prev, curr) => {
        return { ...prev, [curr.id]: curr.filterFn };
      }, {})
    : Object.fromEntries(
        columns.map(({ accessorKey, columnFilterModeOptions }) => [
          accessorKey,
          `${
            columnFilterModeOptions && columnFilterModeOptions.length > 0
              ? columnFilterModeOptions[0]
              : "contains"
          }`,
        ])
      );
  const initialGlobalFilter = searchParams.get("globalFilter") || "";
  const initialSorting = searchParams.get("sorting")
    ? JSON.parse(searchParams.get("sorting")!)
    : [];
  const initialPagination = searchParams.get("pagination")
    ? JSON.parse(searchParams.get("pagination")!)
    : { pageIndex: 0, pageSize: 10 };

  // Manage MRT state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    initialColumnFilters as MRT_ColumnFiltersState
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<MRT_ColumnFilterFnsState>(initialColumnFilterFns);
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter);
  const [sorting, setSorting] = useState<MRT_SortingState>(initialSorting);
  const [pagination, setPagination] =
    useState<MRT_PaginationState>(initialPagination);

  // Debounce values
  const [debouncedColumnFilters] = useDebouncedValue(columnFilters, 300);
  const [debouncedColumnFilterFns] = useDebouncedValue(columnFilterFns, 300);
  const [debouncedGlobalFilter] = useDebouncedValue(globalFilter, 300);
  const [debouncedSorting] = useDebouncedValue(sorting, 300);
  const [debouncedPagination] = useDebouncedValue(pagination, 300);

  // Sync query params with state changes
  useEffect(() => {
    // Merge column filters and filter functions
    const mergedColumnFilters = debouncedColumnFilters
      .filter((filter) => !!filter.value)
      .map((filter) => ({
        ...filter,
        filterFn: debouncedColumnFilterFns[filter.id] || "contains", // Assuming default function, or could be dynamic
        filterVariant: columns.find((e) => {
          return e.id == filter.id;
        })?.filterVariant,
      }));
    const params = new URLSearchParams();

    // Only add column filters to params if there's at least one search term
    if (mergedColumnFilters.length > 0) {
      params.set("columnFilters", JSON.stringify(mergedColumnFilters));
    }
    if (debouncedGlobalFilter) {
      params.set("globalFilter", debouncedGlobalFilter);
    }
    if (debouncedSorting.length > 0) {
      params.set("sorting", JSON.stringify(debouncedSorting));
    }
    if (
      debouncedPagination.pageIndex !== 0 ||
      debouncedPagination.pageSize !== 10
    ) {
      params.set("pagination", JSON.stringify(debouncedPagination));
    }

    setSearchParams(params, { replace: true });

    // Call debounced state change handler
    if (onStateChange) {
      onStateChange({
        columnFilters: mergedColumnFilters,
        globalFilter: debouncedGlobalFilter,
        sorting: debouncedSorting,
        pagination: debouncedPagination,
      });
    }
  }, [
    debouncedColumnFilters,
    debouncedColumnFilterFns,
    debouncedGlobalFilter,
    debouncedSorting,
    debouncedPagination,
    setSearchParams,
    // onStateChange,
  ]);

  // Pass table options to useMantineReactTable
  const table = useMantineReactTable({
    enableRowVirtualization: false,
    columns,
    data,
    enableColumnFilterModes: true,
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: totalRowCount,
    enableMultiSort: true,
    isMultiSortEvent: () => true,
    state: {
      columnFilters,
      columnFilterFns,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    mantineTableContainerProps: {
      ref: tableContainerRef,
      style: { maxHeight: "600px", minHeight: "600px"},
      frameBorder:"0px"
    },
    mantineTableHeadProps: ({}) => ({
      style:{
        padding: "50px",
        textTransform: "uppercase"
      }
    }),
    
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => onRowClick && onRowClick(row, event),
      
      sx: {
        cursor: "pointer",
      },
    }),
    enableRowActions: !!renderRowActions,
    positionActionsColumn: "last",
    renderRowActions: renderRowActions ? renderRowActions : () => <></>,
    renderToolbarInternalActions: ({ table, ...rest }) => (
      <Flex gap="xs" align="center">
        {renderToolbarInternalActions &&
          renderToolbarInternalActions({ table, ...rest })}
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Flex>
    ),
    ...rest,
    initialState: { density: "xs", showColumnFilters: false, ...rest.initialState },
  });
  return <MantineReactTable table={table} />;
}
