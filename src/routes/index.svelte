<script lang="ts">
	import { onMount } from 'svelte';
	import {
		teams,
		locals,
		aways,
		table,
		addTeamInput,
		isTableVisible,
		awaysSelect,
		localsSelect
	} from '../store';
	import { TEMPLATE_TEAMS } from '../template';

	onMount(() => {
		if (window.localStorage.getItem('teams')) {
			$teams = JSON.parse(window.localStorage.getItem('teams'));
			$teams.sort();
			const newArray = [...$teams];
			$localsSelect = newArray;
			$awaysSelect = newArray;
		}
	});

	function addTeam() {
		if ($addTeamInput) {
			const newArray = [...$teams, $addTeamInput];
			// newArray.sort();
			$teams = newArray;
			window.localStorage.setItem('teams', JSON.stringify($teams));
		} else {
			alert('El equipo no está definido');
		}
	}

	function saveTemplateTeams() {
		window.localStorage.setItem('teams', JSON.stringify(TEMPLATE_TEAMS));
	}

	function generateTable() {
		$table = [];
		$isTableVisible = true;
		for (let i = 0; i < $locals.length; i++) {
			const newArray = [...$table, [$locals[i], $aways[i]]];
			$table = newArray;
		}

		console.log($table);
	}

	function deleteAwayDuplicates(event: any) {
		if ($awaysSelect.includes(event.target.value)) {
			$locals.push(event.target.value);
			console.log($locals);
			const index = $awaysSelect.indexOf(event.target.value);
			const newArray = [...$awaysSelect];
			newArray[index] = '';
			$awaysSelect = newArray;
		} else {
			$locals = $locals.filter((item) => {
				return item != event.target.value;
			});
			console.log($locals);

			const index = $localsSelect.indexOf(event.target.value);
			const newArray = [...$awaysSelect];
			newArray[index] = event.target.value;
			$awaysSelect = newArray;
		}
	}

	function deleteLocalDuplicates(event: any) {
		if ($localsSelect.includes(event.target.value)) {
			$aways.push(event.target.value);
			const index = $localsSelect.indexOf(event.target.value);
			const newArray = [...$localsSelect];
			newArray[index] = '';
			$localsSelect = newArray;
		} else {
			$aways = $aways.filter((item) => {
				return item != event.target.value;
			});
			console.log($aways);

			const index = $awaysSelect.indexOf(event.target.value);
			const newArray = [...$localsSelect];
			newArray[index] = event.target.value;
			$localsSelect = newArray;
		}
	}
</script>

<div>
	<input type="text" bind:value={$addTeamInput} />
	<button on:click={addTeam}>Añadir Equipo</button>
</div>
<button on:click={saveTemplateTeams}>Guardar Team</button>
<button on:click={generateTable}>Generar tabla</button>

<div class="select-container">
	<div class="teams-container">
		<h3>Teams</h3>
		{#each $teams as team}
			<button>{team}</button>
		{/each}
	</div>

	<div class="local-container">
		<div class="local-title">
			<h3>Local</h3>
		</div>
		<div class="local-teams">
			{#if $locals.length >= $teams.length / 2}
				{#each $locals as team}
					{#if team}
						<label class="select-team">
							<input on:change={deleteAwayDuplicates} type="checkbox" value={team} checked />
							<p class="team-name">{team}</p>
						</label>
					{/if}
				{/each}
			{:else}
				{#each $localsSelect as local}
					{#if local}
						<label class="select-team">
							<input
								class="lpf-check"
								on:change={deleteAwayDuplicates}
								type="checkbox"
								value={local}
							/>
							<div class="team-name">
								<p>{local}</p>
							</div>
						</label>
					{/if}
				{/each}
			{/if}
		</div>
	</div>

	<div class="away-container">
		<div class="away-title">
			<h3>Away</h3>
		</div>
		<div class="away-teams">
			{#if $aways.length >= $teams.length / 2}
				{#each $aways as away}
					<label class="select-team">
						<input on:change={deleteLocalDuplicates} type="checkbox" value={away} checked />
						<div class="team-name">
							<p>{away}</p>
						</div>
					</label>
				{/each}
			{:else}
				{#each $awaysSelect as team}
					{#if team}
						<label class="select-team">
							<input on:change={deleteLocalDuplicates} type="checkbox" value={team} />
							<div class="team-name">
								<p>{team}</p>
							</div>
						</label>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
	<div>
		<h3>Table</h3>
		{#each $table as match, i}
			<p>{match[0]} - {match[1]}</p>
		{/each}
	</div>
</div>

<style>
	input[type='checkbox'] {
		display: none;
	}

	input[type='checkbox']:checked + .team-name {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgb(223, 223, 223);
	}

	.select-team {
		height: 30px;
		margin-bottom: 5px;
		display: flex;
		border-style: solid;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		width: 135px;
	}

	.teams-container {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: stretch;
		flex-wrap: wrap;
	}

	.select-container {
		height: 850px;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	.away-container {
		display: flex;
		flex-direction: column;
		width: 300px;
	}

	.local-container {
		display: flex;
		flex-direction: column;
		width: 300px;
	}

	.local-teams {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 285px;
	}

	.away-teams {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 285px;
	}
</style>
