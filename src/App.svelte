<script lang="ts">
    import {_} from 'svelte-i18n';
    import {onMount} from "svelte";
    import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
    import type { AxiosError } from 'axios';
    import toast, {Toaster} from 'svelte-french-toast'

    import TopNavigation from "./components/NavigationTop.svelte";
    import BottomNavigation from "./components/NavigationBottom.svelte";
    import Control from "./pages/Control.svelte";
    import Settings from "./pages/Settings.svelte";
    import Tags from "./pages/Tags.svelte";    
    import AccessPoint from "./pages/AccessPoint.svelte";
    import { extractErrorMessage, invalidateSystemQueries, useSystemSettings, useUpdateSystemSettings } from './api';

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

    $: isConnected = false;
    let batteryLevel = 57;

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 15 * 1000,
        }
      },
      queryCache: new QueryCache({
        onSuccess: () => {
          isConnected = true;
        },
        onError: (error: AxiosError<{message?:string}>, query) => {
          // only show error toasts if we already have data in the cache
          // which indicates a failed background update
          if (query.state.data !== undefined) {
            console.log(error);
            let message = "Connection to server lost";
            if(error.code === 'ECONNABORTED'){
              // the server went away and we are really sad now :'(
                isConnected = false;
            } else message = extractErrorMessage(error, "Something went wrong");
            toast.error(message);
            }
        },
      }),
      mutationCache: new MutationCache({
        onSuccess: () => {
          // TODO: enqueue a successfull message here
          console.log("Update successful");
          isConnected = true;
          toast.success("Update successful");
        },
        onError: (error: AxiosError<{message?:string}>) => {
          // TODO: Error handling here with snackbar or something similar
          console.log(error);
          let message = "Connection to server lost";
            if(error.code === 'ECONNABORTED'){
              // the server went away and we are really sad now :'(
                isConnected = false;
            } else message = extractErrorMessage(error, "Update failed");
          toast.error(message);
        },
      })
    });

    const systemSettings = useSystemSettings();
    const updateSystemSettings = useUpdateSystemSettings();

    let reconnectFrequencySeconds = 1;
    let sse;

    const waitFunc = () => { return reconnectFrequencySeconds * 1000 };
    const tryToSetupFunc = () => {
        setupEventSource();
        reconnectFrequencySeconds *= 2;
        if (reconnectFrequencySeconds >= 64) {
            reconnectFrequencySeconds = 64;
        }
    };

    const reconnectFunc = () => { setTimeout(tryToSetupFunc, waitFunc()) };

    const setupEventSource= ()=> {
        sse = new EventSource('/events'); 

        sse.onopen = (e) => {
            reconnectFrequencySeconds = 1;
            isConnected = true;
        };

        sse.onerror = (e) => {
            isConnected = false;
            toast.error("Connection lost...");

            sse.close();
            reconnectFunc();
        };

        sse.addEventListener("status", (e) => {
          invalidateSystemQueries();
        });

        sse.addEventListener("tag", (e) => {
        });

        sse.addEventListener("cover", (e) => {
        });

        sse.addEventListener("trackinfo", (e) => {
        });

        sse.addEventListener("volume", (e) => {
        });
    }

    onMount(() => {
        setupEventSource();
    })

    function changePage(event) {
        main_area.scrollTo(0, 0);
        current_page = event.detail;
    }

    function handleWifiSettings(event) {
        const newSett = {...$systemSettings.data, wifi: event.detail};
        $updateSystemSettings.mutate(newSett);
    }
</script>

<QueryClientProvider client={queryClient}>
  <TopNavigation {navigationPages} page={current_page} {isConnected} {batteryLevel} on:changePage={changePage} />
  <main class="flex flex-col items-center flex-1 h-full overflow-y-auto" bind:this={main_area}>
    {#if $systemSettings.data }
      {#if $systemSettings.data?.wifi?.ssid === "" || $systemSettings.data?.wifi?.ssid === undefined}
        <AccessPoint settings={$systemSettings.data.wifi} on:wifiSettings={handleWifiSettings} />
      {:else}
        <div class="w-full h-full py-4">
          <Control show={current_page === "control"} />
          <Tags show={current_page === "tags"} />
          <Settings show={current_page === "settings"} />
        </div>
      {/if}
    {/if}
  </main>
  <BottomNavigation {navigationPages} page={current_page} on:changePage={changePage} />
  <Toaster />
</QueryClientProvider>
