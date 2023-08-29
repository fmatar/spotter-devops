package com.slixes.interview.model;

import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class BeatRepository implements PanacheRepositoryBase<Beat, Long> {

}
