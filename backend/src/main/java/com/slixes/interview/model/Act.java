package com.slixes.interview.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;


@Entity
@Getter
@Setter
@RegisterForReflection
public class Act {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Schema(hidden = true)
  private Long id;

  private String name;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @JoinColumn(name = "act_id")
  @Schema(hidden = true)
  @JsonIgnore
  private List<Beat> beats;
}