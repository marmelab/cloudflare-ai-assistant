<template>
    <div class="flex items-center gap-2">
        <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content rounded-full w-6">
                <span class="text-xs">B</span>
            </div>
        </div>
        <div class="bg-secondary dark:bg-gray-800 rounded-lg p-3 max-w-[70%]">
            <p><slot></slot></p>
        </div>
    </div>
</template>
