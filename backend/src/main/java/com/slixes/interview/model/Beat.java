package com.slixes.interview.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.eclipse.microprofile.openapi.annotations.media.Schema;


@Entity
@Getter
@Setter
@RegisterForReflection
public class Beat {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Schema(hidden = true)
  private Long id;

  private String name;
  private String time;
  private String content;
  private String cameraAngle;
  private String notes;

  @ManyToOne
  @JoinColumn(name = "act_id")
  @JsonIgnore
  @Schema(hidden = true)
  private Act act;
}