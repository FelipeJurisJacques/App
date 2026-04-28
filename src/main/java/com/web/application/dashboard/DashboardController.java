package com.web.application.dashboard;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/dashboard")
@Profile("dev")
public class DashboardController {

    private final SystemStatsService statsService;

    public DashboardController(SystemStatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public String showDashboard(Model model) {
        model.addAttribute("stats", statsService.getSystemStats());
        return "dashboard";
    }
}
