<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title')</title>

        @vite('resources/css/app.css')
    </head>
    <body class="antialiased font-poppins">
        <div class="relative flex items-top justify-center min-h-screen bg-neutral-950 border border-neutral-800 sm:items-center sm:pt-0">
            <div class="max-w-xl mx-auto sm:px-6 lg:px-8">
                <div class="flex flex-col items-center pt-8 sm:justify-start sm:pt-0">
                    <div class="px-4 text-5xl md:text-7xl lg:text-9xl text-orange-500 tracking-wider">
                        @yield('code')
                    </div>

                    <div class="text-lg text-neutral-500 uppercase tracking-wider">
                        @yield('message')
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
