<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	export let rowNumber: number = 0;
	const pageNumber = handler.getPageNumber();
	const rowsPerPage = handler.getRowsPerPage();
</script>

<td class={$$props.class}>{rowNumber + 1 + ($pageNumber - 1) * ($rowsPerPage ?? 0)}</td>
