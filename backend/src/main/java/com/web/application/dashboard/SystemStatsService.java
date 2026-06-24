package com.web.application.dashboard;

import org.springframework.stereotype.Service;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;
import oshi.hardware.HardwareAbstractionLayer;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Service
public class SystemStatsService {

    private final SystemInfo systemInfo = new SystemInfo();
    private final HardwareAbstractionLayer hal = systemInfo.getHardware();

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Performance Stats
        stats.put("cpu", getCpuUsage());
        stats.put("memory", getMemoryStats());
        
        // Storage Stats
        stats.put("storage", getStorageStats());
        
        return stats;
    }

    private Map<String, Object> getCpuUsage() {
        CentralProcessor processor = hal.getProcessor();
        long[] prevTicks = processor.getSystemCpuLoadTicks();
        try {
            Thread.sleep(200); // Small delay to calculate load
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        double load = processor.getSystemCpuLoadBetweenTicks(prevTicks) * 100;
        
        Map<String, Object> cpu = new HashMap<>();
        cpu.put("load", load);
        cpu.put("cores", processor.getLogicalProcessorCount());
        cpu.put("name", processor.getProcessorIdentifier().getName());
        return cpu;
    }

    private Map<String, Object> getMemoryStats() {
        GlobalMemory memory = hal.getMemory();
        long total = memory.getTotal();
        long available = memory.getAvailable();
        long used = total - available;
        double percent = (double) used / total * 100;

        Map<String, Object> mem = new HashMap<>();
        mem.put("total", formatBytes(total));
        mem.put("used", formatBytes(used));
        mem.put("available", formatBytes(available));
        mem.put("percent", percent);
        return mem;
    }

    private Map<String, Object> getStorageStats() {
        File root = new File("/");
        long totalSpace = root.getTotalSpace();
        long freeSpace = root.getFreeSpace();
        long usedSpace = totalSpace - freeSpace;
        double percent = (double) usedSpace / totalSpace * 100;

        Map<String, Object> storage = new HashMap<>();
        storage.put("total", formatBytes(totalSpace));
        storage.put("used", formatBytes(usedSpace));
        storage.put("free", formatBytes(freeSpace));
        storage.put("percent", percent);
        return storage;
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
