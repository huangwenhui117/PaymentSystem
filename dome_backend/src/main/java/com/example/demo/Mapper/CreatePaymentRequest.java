package com.example.demo.Mapper;

import java.math.BigDecimal;

public record CreatePaymentRequest(String name, String email, String description, BigDecimal amount) {
}
