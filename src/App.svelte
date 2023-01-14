<script lang='ts'>
    import {_} from 'svelte-i18n';

    import TopNavigation from "./components/NavigationTop.svelte";
    import BottomNavigation from "./components/NavigationBottom.svelte";
    import Control from "./pages/Control.svelte";
    import Settings from "./pages/Settings.svelte";
    import Tags from "./pages/Tags.svelte";
    import {onDestroy, onMount} from "svelte";
    import axios from "axios";
    import AccessPoint from "./pages/AccessPoint.svelte";

    import {settings, systemState} from './store';
  import { init } from 'svelte/internal';

    // @formatter:off
    const navigationPages = [
        // [id,      name,                     icon]
        ["control",  $_("control.page_name"),  "play-pause"],
        ["tags",     $_("tags.page_name"),     "nfc"],
        ["settings", $_("settings.page_name"), "sliders"],
    ];
    // @formatter:on

    let current_page = "control";
    let main_area;

    let isConnected = false;
    let batteryLevel = 57;

    onMount(() => {
        const sse = new EventSource('/events');

        sse.onopen = (e) => {
            isConnected = true;
        }

        sse.onerror = (e) => {
            isConnected = true;
            // TODO show error message
        }

        sse.addEventListener("status", (e) => {
            systemState.update((state) => {
                return {...state, ...e.data};
            });
        });

        sse.addEventListener("tag", (e) => {
        });

        sse.addEventListener("cover", (e) => {
        });

        sse.addEventListener("trackinfo", (e) => {
        });

        sse.addEventListener("volume", (e) => {
        });
    })

    function changePage(event) {
        main_area.scrollTo(0, 0);
        current_page = event.detail;
    }

    function handleWifiSettings(event) {
        const newSett = {...$settings, wifi: event.detail};
        settings.set(newSett);
    }
</script>

<TopNavigation navigationPages={navigationPages} page={current_page} {isConnected} {batteryLevel} on:changePage={changePage}/>
<main class="flex flex-col items-center flex-1 h-full overflow-y-auto" bind:this={main_area}>
{#await settings.init() then}
  {#if $settings?.wifi?.ssid === "" || $settings?.wifi?.ssid === undefined}
    <AccessPoint settings={$settings.wifi} on:wifiSettings={handleWifiSettings}/>
  {:else}
    <div class="w-full h-full py-4">
      <Control show={current_page === "control"}/>
      <Tags show={current_page === "tags"}/>
      <Settings show={current_page === "settings"}/>
    </div>
  {/if}
{/await}
</main>
<BottomNavigation navigationPages={navigationPages} page={current_page} on:changePage={changePage}/>
